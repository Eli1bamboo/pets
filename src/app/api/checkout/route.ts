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
        const { fulfillment_type = "pickup", notes } = body;

        // 1. Get user's cart with items + product details
        const { data: cart } = await supabase
            .from("carts")
            .select("id")
            .eq("user_id", user.id)
            .single();

        if (!cart) {
            return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
        }

        const { data: cartItems } = await supabase
            .from("cart_items")
            .select("*, product:products(*)")
            .eq("cart_id", cart.id);

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
        }

        // 2. Validate stock for all items
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

        // 3. Calculate totals
        const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        const shippingFee = 0; // Phase 2: pickup only
        const total = subtotal + shippingFee;

        // 4. Create the order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                user_id: user.id,
                status: "pending",
                subtotal,
                shipping_fee: shippingFee,
                total,
                fulfillment: fulfillment_type,
                notes,
            })
            .select("id")
            .single();

        if (orderError || !order) {
            console.error("Order creation error:", orderError);
            return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 });
        }

        // 5. Create order items (snapshot)
        const orderItems = cartItems.map((item) => ({
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
            // Clean up the order
            await supabase.from("orders").delete().eq("id", order.id);
            return NextResponse.json({ error: "Error al crear los items de la orden" }, { status: 500 });
        }

        // 6. Create MercadoPago preference
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        const proto = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host") || "localhost:3000";
        const baseUrl = appUrl || `${proto}://${host}`;
        const isLocalhost = baseUrl.includes("localhost");

        const preference = new Preference(mpClient);

        const preferenceBody: any = {
            items: cartItems.map((item) => ({
                id: String(item.product.id),
                title: item.product.name,
                quantity: item.quantity,
                unit_price: Number(item.product.price),
                currency_id: "ARS",
            })),
            external_reference: String(order.id),
        };

        // MercadoPago rejects localhost URLs for back_urls/auto_return
        if (!isLocalhost) {
            preferenceBody.back_urls = {
                success: `${baseUrl}/checkout/success?order_id=${order.id}`,
                failure: `${baseUrl}/checkout/failure?order_id=${order.id}`,
                pending: `${baseUrl}/checkout/success?order_id=${order.id}&pending=true`,
            };
            preferenceBody.auto_return = "approved";
            preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
        }

        const mpPreference = await preference.create({ body: preferenceBody });

        // 7. Update order with MP preference ID
        await supabase
            .from("orders")
            .update({ mp_preference_id: mpPreference.id })
            .eq("id", order.id);

        return NextResponse.json({
            init_point: mpPreference.init_point,
            order_id: order.id,
        });
    } catch (error: any) {
        console.error("Checkout error:", error);
        const message = error?.message || error?.cause?.message || "Error en el checkout";
        return NextResponse.json({ error: message, detail: String(error) }, { status: 500 });
    }
}
