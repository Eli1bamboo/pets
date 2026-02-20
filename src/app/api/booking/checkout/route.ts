import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const body = await request.json();
        const { appointment_id, include_cart = false } = body;

        if (!appointment_id) {
            return NextResponse.json({ error: "appointment_id requerido" }, { status: 400 });
        }

        // Fetch the appointment and validate ownership
        const { data: appointment, error: aptError } = await supabase
            .from("appointments")
            .select("*")
            .eq("id", appointment_id)
            .eq("user_id", user.id)
            .single();

        if (aptError || !appointment) {
            return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
        }

        if (appointment.payment_status === "paid") {
            return NextResponse.json({ error: "Este turno ya fue pagado" }, { status: 400 });
        }

        // Build MercadoPago items — service is always the first item
        const mpItems: any[] = [
            {
                id: `appointment_${appointment.id}`,
                title: appointment.service,
                description: `Turno para ${appointment.pet_name}`,
                quantity: 1,
                unit_price: Number(appointment.price),
                currency_id: "ARS",
            },
        ];

        let cartItems: any[] = [];
        let orderId: number | null = null;

        // If customer also has cart items, add them to the same preference
        if (include_cart) {
            const { data: cart } = await supabase
                .from("carts")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (cart) {
                const { data: items } = await supabase
                    .from("cart_items")
                    .select("*, product:products(*)")
                    .eq("cart_id", cart.id);

                if (items && items.length > 0) {
                    cartItems = items;

                    // Validate stock
                    for (const item of cartItems) {
                        const product = item.product;
                        if (!product || !product.is_active) {
                            return NextResponse.json(
                                { error: `Producto "${product?.name || "desconocido"}" ya no está disponible` },
                                { status: 400 }
                            );
                        }
                        if (product.stock_quantity < item.quantity) {
                            return NextResponse.json(
                                { error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock_quantity}` },
                                { status: 400 }
                            );
                        }
                    }

                    // Add product items to MP preference
                    for (const item of cartItems) {
                        mpItems.push({
                            id: String(item.product.id),
                            title: item.product.name,
                            quantity: item.quantity,
                            unit_price: Number(item.product.price),
                            currency_id: "ARS",
                        });
                    }

                    // Create an order for the products (pickup at the shop when they pick up their pet)
                    const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);

                    const { data: order, error: orderError } = await supabase
                        .from("orders")
                        .insert({
                            user_id: user.id,
                            status: "pending",
                            subtotal,
                            shipping_fee: 0,
                            total: subtotal,
                            fulfillment: "pickup",
                            notes: `Retiro junto con turno #${appointment.id}`,
                        })
                        .select("id")
                        .single();

                    if (orderError || !order) {
                        console.error("Order creation error:", orderError);
                        return NextResponse.json({ error: "Error al crear la orden de productos" }, { status: 500 });
                    }

                    orderId = order.id;

                    // Create order items snapshot
                    const orderItems = cartItems.map((item: any) => ({
                        order_id: order.id,
                        product_id: item.product.id,
                        product_name: item.product.name,
                        product_price: item.product.price,
                        quantity: item.quantity,
                        subtotal: item.product.price * item.quantity,
                    }));

                    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
                    if (itemsError) {
                        console.error("Order items error:", itemsError);
                        await supabase.from("orders").delete().eq("id", order.id);
                        return NextResponse.json({ error: "Error al crear los items de la orden" }, { status: 500 });
                    }
                }
            }
        }

        // Build MercadoPago preference
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        const proto = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host") || "localhost:3000";
        const baseUrl = appUrl || `${proto}://${host}`;
        const isLocalhost = baseUrl.includes("localhost");

        const preference = new Preference(mpClient);

        // Use external_reference format: "appointment_<id>" or "appointment_<id>_order_<orderId>"
        const externalRef = orderId
            ? `appointment_${appointment.id}_order_${orderId}`
            : `appointment_${appointment.id}`;

        const preferenceBody: any = {
            items: mpItems,
            external_reference: externalRef,
        };

        preferenceBody.back_urls = {
            success: `${baseUrl}/booking/success?appointment_id=${appointment.id}`,
            failure: `${baseUrl}/booking/failure?appointment_id=${appointment.id}`,
            pending: `${baseUrl}/booking/success?appointment_id=${appointment.id}&pending=true`,
        };

        if (!isLocalhost) {
            preferenceBody.auto_return = "approved";
            preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
        }

        const mpPreference = await preference.create({ body: preferenceBody });

        // Update appointment with preference ID
        await supabase
            .from("appointments")
            .update({
                mp_preference_id: mpPreference.id,
                payment_status: "pending",
            })
            .eq("id", appointment.id);

        // Update order with preference ID if applicable
        if (orderId) {
            await supabase
                .from("orders")
                .update({ mp_preference_id: mpPreference.id })
                .eq("id", orderId);

            // Clear the cart
            const { data: cart } = await supabase
                .from("carts")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (cart) {
                await supabase.from("cart_items").delete().eq("cart_id", cart.id);
            }
        }

        return NextResponse.json({
            init_point: mpPreference.init_point,
            appointment_id: appointment.id,
            order_id: orderId,
        });
    } catch (error: any) {
        console.error("Booking checkout error:", error);
        const message = error?.message || error?.cause?.message || "Error en el checkout";
        return NextResponse.json({ error: message, detail: String(error) }, { status: 500 });
    }
}
