import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface CreateBookingData {
    userId: string;
    petName: string;
    service: string;
    date: string;
    time: string;
    price: number;
}

export function useBooking() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    const createBooking = async ({ userId, petName, service, date, time, price }: CreateBookingData) => {
        setSubmitting(true);
        setError(null);
        const { data, error: insertError } = await supabase.from("appointments").insert({
            user_id: userId,
            pet_name: petName,
            service: service,
            date: new Date(`${date}T${time}`).toISOString(),
            status: "pending",
            price,
        }).select("id").single();

        setSubmitting(false);

        if (insertError || !data) {
            const msg = insertError?.message || "Error al crear el turno";
            setError(msg);
            return { success: false as const, error: msg };
        }

        return { success: true as const, appointmentId: data.id };
    };

    return { createBooking, submitting, error };
}
