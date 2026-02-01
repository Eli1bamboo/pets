import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface CreateBookingData {
    userId: string;
    petName: string;
    service: string;
    date: string;
    time: string;
}

export function useBooking() {
    const [submitting, setSubmitting] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const createBooking = async ({ userId, petName, service, date, time }: CreateBookingData) => {
        setSubmitting(true);
        const { error } = await supabase.from("appointments").insert({
            user_id: userId,
            pet_name: petName,
            service: service,
            date: new Date(`${date}T${time}`).toISOString(),
            status: "pending",
        });

        if (error) {
            alert("Error: " + error.message);
            setSubmitting(false);
            return false;
        } else {
            router.push("/profile");
            return true;
        }
    };

    return { createBooking, submitting };
}
