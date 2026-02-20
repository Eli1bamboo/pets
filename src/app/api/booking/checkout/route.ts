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
        const { appointment_id } = body;

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

        // Build MercadoPago preference
        const appUrl = process.env.NEXT_PUBLIC_APP_URL;
        const proto = request.headers.get("x-forwarded-proto") || "http";
        const host = request.headers.get("host") || "localhost:3000";
        const baseUrl = appUrl || `${proto}://${host}`;
        const isLocalhost = baseUrl.includes("localhost");

        const preference = new Preference(mpClient);

        const preferenceBody: any = {
            items: [
                {
                    id: `appointment_${appointment.id}`,
                    title: appointment.service,
                    description: `Turno para ${appointment.pet_name}`,
                    quantity: 1,
                    unit_price: Number(appointment.price),
                    currency_id: "ARS",
                },
            ],
            // Prefix with "appointment_" so the webhook can distinguish from product orders
            external_reference: `appointment_${appointment.id}`,
        };

        if (!isLocalhost) {
            preferenceBody.back_urls = {
                success: `${baseUrl}/booking/success?appointment_id=${appointment.id}`,
                failure: `${baseUrl}/booking/failure?appointment_id=${appointment.id}`,
                pending: `${baseUrl}/booking/success?appointment_id=${appointment.id}&pending=true`,
            };
            preferenceBody.auto_return = "approved";
            preferenceBody.notification_url = `${baseUrl}/api/webhooks/mercadopago`;
        }

        const mpPreference = await preference.create({ body: preferenceBody });

        // Update appointment with preference ID and set payment to pending
        await supabase
            .from("appointments")
            .update({
                mp_preference_id: mpPreference.id,
                payment_status: "pending",
            })
            .eq("id", appointment.id);

        return NextResponse.json({
            init_point: mpPreference.init_point,
            appointment_id: appointment.id,
        });
    } catch (error: any) {
        console.error("Booking checkout error:", error);
        const message = error?.message || error?.cause?.message || "Error en el checkout";
        return NextResponse.json({ error: message, detail: String(error) }, { status: 500 });
    }
}
