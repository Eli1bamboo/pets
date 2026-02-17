import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

    const createBooking = async ({ userId, petName, service, date, time, price }: CreateBookingData) => {
        setSubmitting(true);
        setError(null);
        const { error: insertError } = await supabase.from("appointments").insert({
            user_id: userId,
            pet_name: petName,
            service: service,
            date: new Date(`${date}T${time}`).toISOString(),
            status: "pending",
            price,
        });

        setSubmitting(false);

        if (insertError) {
            setError(insertError.message);
            return { success: false, error: insertError.message };
        }

        router.push("/profile");
        return { success: true };
    };

    return { createBooking, submitting, error };
}
