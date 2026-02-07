export type UserRole = 'admin' | 'customer';

export type AppointmentStatus = 'pending' | 'washing' | 'drying' | 'ready' | 'completed' | 'cancelled';

export interface BusinessHours {
    id: number;
    day_of_week: number; // 0-6
    open_time: string; // "HH:MM"
    close_time: string; // "HH:MM"
    is_active: boolean;
}

export interface Profile {
    id: string;
    full_name: string | null;
    role: UserRole;
    created_at: string;
}

export interface Appointment {
    id: number;
    created_at: string;
    user_id: string;
    pet_name: string;
    service: string;
    date: string;
    status: AppointmentStatus;
    profiles?: {
        full_name: string | null;
    };
}
export interface AppointmentLog {
    id: string;
    appointment_id: number;
    description: string;
    created_at: string;
}
