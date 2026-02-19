import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { MercadoPagoConfig, Payment } from "mercadopago";

const mpClient = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Use service role for webhook (no user session)
function createServiceClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll: () => [], setAll: () => { } } }
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // MercadoPago sends different notification types
        if (body.type !== "payment" && body.action !== "payment.updated") {
            return NextResponse.json({ received: true });
        }

        const paymentId = body.data?.id;
        if (!paymentId) {
            return NextResponse.json({ error: "No payment ID" }, { status: 400 });
        }

        // Fetch payment details from MercadoPago
        const paymentClient = new Payment(mpClient);
        const payment = await paymentClient.get({ id: paymentId });

        if (!payment || !payment.external_reference) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        const orderId = Number(payment.external_reference);
        const supabase = createServiceClient();

        // Check if already processed (idempotent)
        const { data: existingOrder } = await supabase
            .from("orders")
            .select("id, status, mp_payment_id")
            .eq("id", orderId)
            .single();

        if (!existingOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Skip if already processed with this payment
        if (existingOrder.mp_payment_id === String(paymentId) && existingOrder.status !== "pending") {
            return NextResponse.json({ already_processed: true });
        }

        if (payment.status === "approved") {
            // Update order status to paid
            await supabase
                .from("orders")
                .update({
                    status: "paid",
                    mp_payment_id: String(paymentId),
                    mp_status: payment.status,
                })
                .eq("id", orderId);

            // Deduct inventory and log changes
            const { data: orderItems } = await supabase
                .from("order_items")
                .select("product_id, quantity")
                .eq("order_id", orderId);

            if (orderItems) {
                for (const item of orderItems) {
                    // Get current stock
                    const { data: product } = await supabase
                        .from("products")
                        .select("stock_quantity")
                        .eq("id", item.product_id)
                        .single();

                    if (product) {
                        const newQty = Math.max(0, product.stock_quantity - item.quantity);

                        // Update stock
                        await supabase
                            .from("products")
                            .update({ stock_quantity: newQty })
                            .eq("id", item.product_id);

                        // Log inventory change
                        await supabase.from("inventory_logs").insert({
                            product_id: item.product_id,
                            change_quantity: -item.quantity,
                            new_quantity: newQty,
                            reason: "sale",
                            reference_id: `order_${orderId}`,
                        });
                    }
                }
            }

            // Clear the user's cart
            const { data: order } = await supabase
                .from("orders")
                .select("user_id")
                .eq("id", orderId)
                .single();

            if (order) {
                const { data: cart } = await supabase
                    .from("carts")
                    .select("id")
                    .eq("user_id", order.user_id)
                    .single();

                if (cart) {
                    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
                }
            }
        } else if (payment.status === "rejected" || payment.status === "cancelled") {
            await supabase
                .from("orders")
                .update({
                    status: "cancelled",
                    mp_payment_id: String(paymentId),
                    mp_status: payment.status,
                })
                .eq("id", orderId);
        } else {
            // pending or other statuses — just update MP fields
            await supabase
                .from("orders")
                .update({
                    mp_payment_id: String(paymentId),
                    mp_status: payment.status,
                })
                .eq("id", orderId);
        }

        return NextResponse.json({ processed: true });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
