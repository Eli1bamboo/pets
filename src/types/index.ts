export type UserRole = 'admin' | 'customer';

export type AppointmentStatus = 'pending' | 'washing' | 'drying' | 'ready' | 'completed' | 'cancelled';

export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'refunded' | 'cancelled';

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
    // Payment fields (Phase 4)
    mp_payment_id: string | null;
    mp_preference_id: string | null;
    mp_status: string | null;
    payment_status: PaymentStatus;
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

// ============================================
// Marketplace Types
// ============================================

export interface ProductCategory {
    id: number;
    name: string;
    name_en: string | null;
    slug: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export interface Product {
    id: number;
    category_id: number | null;
    name: string;
    name_en: string | null;
    description: string | null;
    description_en: string | null;
    price: number;
    compare_at_price: number | null;
    sku: string | null;
    stock_quantity: number;
    low_stock_threshold: number;
    is_active: boolean;
    is_featured: boolean;
    weight_grams: number | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
    // Joined relations
    category?: ProductCategory;
    images?: ProductImage[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
    created_at: string;
}

export type InventoryReason = 'sale' | 'restock' | 'adjustment' | 'return' | 'damage';

export interface InventoryLog {
    id: number;
    product_id: number;
    change_quantity: number;
    new_quantity: number;
    reason: InventoryReason;
    reference_id: string | null;
    created_by: string | null;
    created_at: string;
    // Joined
    product?: Product;
}

// ============================================
// Cart & Orders
// ============================================

export type OrderStatus =
    | 'pending' | 'paid' | 'preparing' | 'ready_for_pickup'
    | 'shipped' | 'delivered' | 'cancelled';

export type FulfillmentType = 'pickup' | 'delivery';

export interface Cart {
    id: number;
    user_id: string;
    updated_at: string;
    // Joined
    items?: CartItem[];
}

export interface CartItem {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    created_at: string;
    // Joined
    product?: Product;
}

export interface Order {
    id: number;
    user_id: string;
    status: OrderStatus;
    subtotal: number;
    shipping_fee: number;
    total: number;
    fulfillment: FulfillmentType;
    shipping_address: Record<string, string> | null;
    payment_status: PaymentStatus;
    mp_payment_id: string | null;
    mp_preference_id: string | null;
    mp_status: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Joined
    items?: OrderItem[];
    profiles?: { full_name: string | null };
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number | null;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
}

// Phase 3 — Delivery & Fulfillment

export interface UserAddress {
    id: number;
    user_id: string;
    label: string;
    street: string;
    city: string;
    state: string | null;
    zip_code: string | null;
    notes: string | null;
    is_default: boolean;
    created_at: string;
}

export interface ShippingZone {
    id: number;
    name: string;
    zip_codes: string[];
    flat_fee: number;
    free_shipping_min: number | null;
    is_active: boolean;
    created_at: string;
}

