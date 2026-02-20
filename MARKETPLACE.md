# 🛍️ E-Commerce Expansion Plan — Peluquería Canina

## Overview

Expand the app from a **service-booking platform** into a **service + product commerce platform**. Customers can browse and purchase pet products (shampoo, accessories, treats), pick up at the shop or get them delivered, and optionally bundle products with grooming services.

> [!IMPORTANT]
> This is a **major feature expansion** broken into 4 phases. Each phase is independently deployable and delivers standalone value.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Payment** | MercadoPago Checkout Pro | Popular in AR, handles security, supports cards/cash/wallet |
| **Product Images** | Supabase Storage | Already using Supabase, keeps infra unified |
| **Cart** | Database-backed | Persists across sessions/devices, enables abandoned cart analytics |
| **Inventory** | Full audit trail | `inventory_logs` table tracks every stock change with reason |
| **Delivery** | Pickup + Shipping | Two fulfillment modes with address management |

---

## Phase 1 — Product Catalog & Admin Management
*Foundation: Products exist in the system and admins can manage them.*

### Database

```sql
-- Product categories
CREATE TABLE product_categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_en TEXT,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'package',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id BIGINT REFERENCES product_categories(id),
    name TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    description_en TEXT,
    price NUMERIC(10,2) NOT NULL,
    compare_at_price NUMERIC(10,2),  -- "Was $X" strikethrough price
    sku TEXT UNIQUE,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    weight_grams INT,                -- for shipping calc
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inventory audit log
CREATE TABLE inventory_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id BIGINT REFERENCES products(id) NOT NULL,
    change_quantity INT NOT NULL,      -- +10 restock, -1 sale
    new_quantity INT NOT NULL,
    reason TEXT NOT NULL,              -- 'sale', 'restock', 'adjustment', 'return', 'damage'
    reference_id TEXT,                 -- order_id or manual note
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Admin Features
- **Product CRUD**: Name, description, price, compare price, SKU, category, image upload (Supabase Storage), weight
- **Category Management**: Create/edit/reorder categories
- **Inventory Dashboard**: Stock levels, low-stock alerts (badge on sidebar), stock adjustment form with reason logging
- **Inventory History**: Filterable log of all stock changes

### Customer Features
- **Product Catalog Page** (`/shop`): Grid view with category filter, search, sort by price/name
- **Product Detail Page** (`/shop/[id]`): Images, description, price, "Add to Cart" button, stock indicator

### New Routes

| Route | Experience | Description |
|---|---|---|
| `/shop` | Customer | Product catalog with filtering |
| `/shop/[id]` | Customer | Product detail page |
| `/admin/products` | Admin | Product CRUD & inventory |
| `/admin/products/inventory` | Admin | Inventory dashboard & logs |

---

## Phase 2 — Cart & Checkout with MercadoPago
*Customers can buy products and pay online.*

### Database

```sql
-- Shopping cart (persistent, DB-backed)
CREATE TABLE carts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL UNIQUE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cart items
CREATE TABLE cart_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cart_id BIGINT REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    UNIQUE(cart_id, product_id)
);

-- Orders
CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'paid', 'preparing', 'ready_for_pickup',
        'shipped', 'delivered', 'cancelled', 'refunded'
    )),
    subtotal NUMERIC(10,2) NOT NULL,
    shipping_fee NUMERIC(10,2) DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('pickup', 'delivery')),
    shipping_address JSONB,           -- {street, city, zip, notes}
    mp_payment_id TEXT,               -- MercadoPago payment ID
    mp_preference_id TEXT,            -- MercadoPago preference ID
    mp_status TEXT,                   -- MercadoPago payment status
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order line items (snapshot of product at time of purchase)
CREATE TABLE order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    product_name TEXT NOT NULL,       -- snapshot
    product_price NUMERIC(10,2) NOT NULL, -- snapshot
    quantity INT NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);
```

### MercadoPago Integration

```
┌─────────────┐    POST /api/checkout     ┌──────────────┐
│  Customer   │ ───────────────────────► │  Next.js API  │
│  (React)    │                          │  Route        │
│             │ ◄─────────────────────── │               │
│  Redirect   │   { init_point URL }     │  Creates MP   │
│  to MP      │                          │  Preference   │
└─────────────┘                          └──────────────┘
                                                │
       ┌────────────────────────────────────────┘
       ▼
┌──────────────┐   Webhook POST          ┌──────────────┐
│  MercadoPago │ ───────────────────────► │  /api/webhook │
│  Checkout    │                          │  /mercadopago │
│              │                          │               │
│  Payment     │                          │  Updates      │
│  completed   │                          │  order status │
└──────────────┘                          │  + inventory  │
                                          └──────────────┘
```

**Dependencies**: `mercadopago` (server SDK), `@mercadopago/sdk-react` (optional, for inline checkout)

### Key API Routes (Next.js Route Handlers)
- `POST /api/checkout` — Creates MercadoPago preference from cart, returns redirect URL
- `POST /api/webhooks/mercadopago` — Receives payment notifications, updates order status, deducts inventory
- `GET /api/orders/[id]` — Order details (used by success/failure pages)

### Customer Features
- **Cart Sidebar/Page**: View items, adjust quantity, remove items, see subtotal
- **Checkout Page** (`/checkout`): Choose pickup vs delivery, enter shipping address if delivery, review order, "Pay with MercadoPago" button
- **Order Success/Failure Pages**: Post-payment landing pages
- **Order History** (`/profile/orders`): Past orders with status

### Admin Features
- **Order Management** (`/admin/orders`): List all orders, filter by status, update fulfillment status
- **Order Detail**: View items, payment info, customer info, update status (preparing → ready → shipped/delivered)

---

## Phase 3 — Delivery & Fulfillment
*Support both pickup and shipping with address management.*

### Database

```sql
-- User addresses (reusable for future orders)
CREATE TABLE user_addresses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    label TEXT DEFAULT 'Home',         -- 'Home', 'Work', etc.
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    notes TEXT,                         -- "Ring doorbell twice"
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Shipping zones (optional, for delivery fee calculation)
CREATE TABLE shipping_zones (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,                 -- 'Local', 'CABA', 'GBA'
    zip_codes TEXT[],                   -- array of zip code patterns
    flat_fee NUMERIC(10,2) NOT NULL,
    free_shipping_min NUMERIC(10,2),    -- free shipping above $X
    is_active BOOLEAN DEFAULT true
);
```

### Features
- **Address Book**: Customers save/manage multiple addresses
- **Delivery Fee Calculation**: Based on shipping zones or flat rate
- **Free Shipping Threshold**: "Free delivery on orders over $X"
- **Fulfillment Tracking**: Order status updates visible to customers (preparing → shipped → delivered)

---

## Phase 4 — MercadoPago for Service Payments
*Allow customers to pay for grooming services online via MercadoPago. Lays the payment foundation for the booking flow.*

### Database

```sql
-- Add payment fields to appointments
ALTER TABLE appointments
    ADD COLUMN mp_payment_id TEXT,
    ADD COLUMN mp_preference_id TEXT,
    ADD COLUMN mp_status TEXT,
    ADD COLUMN payment_status TEXT DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'refunded'));
```

### Key API Routes
- `POST /api/booking/checkout` — Creates MercadoPago preference for an appointment, returns redirect URL
- `POST /api/webhooks/mercadopago` — Extended to handle both product orders and service payments (distinguished via `external_reference` prefix)

### Features
- **Pay at Booking**: After confirming the appointment, customer is redirected to MercadoPago to pay for the service
- **Payment Status Tracking**: Appointment status reflects payment (`unpaid` → `pending` → `paid`)
- **Admin Visibility**: Admin appointment views show payment status and MP payment ID
- **Booking Success/Failure Pages**: Post-payment landing pages for service bookings

---

## Phase 5 — Booking Product Add-ons
*Let customers browse & add products during booking, to pick up with their pet. Builds on Phase 4's payment flow.*

### Database

No new tables — reuses the existing **cart** and **products** infrastructure from Phases 1 & 2.

### Features
- **In-Booking Product Browser**: Collapsible section in the booking flow — "Agregá productos a tu servicio — Retiralos cuando busques a tu mascota"
- **Category Filter**: Quick-filter pills to browse by category (same as shop page)
- **Cart Integration**: "Add" button per product uses existing `CartProvider`
- **BookingSummary Update**: Shows cart item count + total alongside the service price
- **Combined Checkout**: Single MercadoPago preference includes both the service and any cart products (unified payment built on Phase 4)

---

## Summary — Effort Estimate

| Phase | Scope | Effort |
|---|---|---|
| **Phase 1** ✅ | Product catalog, categories, inventory | ~3-4 sessions |
| **Phase 2** ✅ | Cart, checkout, MercadoPago, orders | ~4-5 sessions |
| **Phase 3** | Delivery, addresses, shipping zones | ~2-3 sessions |
| **Phase 4** | MercadoPago for service payments | ~2-3 sessions |
| **Phase 5** | Booking product add-ons | ~1-2 sessions |

> [!TIP]
> **Recommended order**: Phase 1 → Phase 2 → Phase 4 → Phase 5 → Phase 3. Service payments (Phase 4) must come before product add-ons (Phase 5) so we have a unified payment flow. Delivery (Phase 3) comes last since pickup-only works fine initially.

---

## New Feature Structure

```
src/features/
├── admin/
│   └── components/
│       ├── organisms/
│       │   ├── ProductManager.tsx      # Phase 1
│       │   ├── InventoryDashboard.tsx   # Phase 1
│       │   └── OrderManager.tsx         # Phase 2
├── customer/
│   └── components/
│       ├── organisms/
│       │   ├── ProductCatalog.tsx       # Phase 1
│       │   ├── CartSidebar.tsx          # Phase 2
│       │   ├── CheckoutForm.tsx         # Phase 2
│       │   ├── OrderHistory.tsx         # Phase 2
│       │   └── BookingProductBrowser.tsx # Phase 4
├── shop/ (NEW feature module)
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   ├── useOrders.ts
│   │   └── useInventory.ts
│   └── components/
│       ├── ProductCard.tsx
│       ├── ProductDetail.tsx
│       └── CartItem.tsx
```
