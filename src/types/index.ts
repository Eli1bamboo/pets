export type UserRole = 'admin' | 'customer';

export type AppointmentStatus = 'pending' | 'washing' | 'drying' | 'ready' | 'completed' | 'cancelled';

export interface BusinessHours {
    id: number;
    day_of_week: number;
    open_time: string;
    close_time: string;
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
    price: number;
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

export interface Service {
    id: number;
    name: string;
    name_en: string | null;
    price: number;
    description: string | null;
    description_en: string | null;
    features: string[];
    features_en: string[];
    icon: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

export interface BusinessSettings {
    key: string;
    value: any;
    updated_at: string;
}
