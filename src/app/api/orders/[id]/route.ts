import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const { id } = await params;
        const orderId = Number(id);

        const { data: order, error } = await supabase
            .from("orders")
            .select("*, items:order_items(*)")
            .eq("id", orderId)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }

        // Ensure user can only see their own orders (RLS should handle this, but extra check)
        if (order.user_id !== user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order fetch error:", error);
        return NextResponse.json({ error: "Error al obtener la orden" }, { status: 500 });
    }
}
