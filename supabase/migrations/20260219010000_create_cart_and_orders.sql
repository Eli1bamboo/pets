-- ============================================
-- Phase 2: Cart & Orders
-- ============================================

-- ─── Shopping Cart ───────────────────────────

create table carts (
    id bigint generated always as identity primary key,
    user_id uuid references profiles(id) not null unique,
    updated_at timestamptz default now()
);

create table cart_items (
    id bigint generated always as identity primary key,
    cart_id bigint references carts(id) on delete cascade not null,
    product_id bigint references products(id) not null,
    quantity int not null default 1 check (quantity > 0),
    created_at timestamptz default now(),
    unique(cart_id, product_id)
);

-- ─── Orders ──────────────────────────────────

create type order_status as enum (
    'pending', 'paid', 'preparing', 'ready_for_pickup',
    'shipped', 'delivered', 'cancelled', 'refunded'
);

create type fulfillment_type as enum ('pickup', 'delivery');

create table orders (
    id bigint generated always as identity primary key,
    user_id uuid references profiles(id) not null,
    status order_status default 'pending' not null,
    subtotal numeric(10,2) not null,
    shipping_fee numeric(10,2) default 0,
    total numeric(10,2) not null,
    fulfillment fulfillment_type not null default 'pickup',
    shipping_address jsonb,
    mp_payment_id text,
    mp_preference_id text,
    mp_status text,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table order_items (
    id bigint generated always as identity primary key,
    order_id bigint references orders(id) on delete cascade not null,
    product_id bigint references products(id),
    product_name text not null,
    product_price numeric(10,2) not null,
    quantity int not null,
    subtotal numeric(10,2) not null
);

-- ─── Indexes ─────────────────────────────────

create index idx_carts_user on carts(user_id);
create index idx_cart_items_cart on cart_items(cart_id);
create index idx_orders_user on orders(user_id);
create index idx_orders_status on orders(status);
create index idx_order_items_order on order_items(order_id);

-- ─── RLS Policies ────────────────────────────

alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Carts: users see own cart
create policy "Users manage own cart"
    on carts for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Cart items: users manage items in own cart
create policy "Users manage own cart items"
    on cart_items for all
    using (
        cart_id in (select id from carts where user_id = auth.uid())
    )
    with check (
        cart_id in (select id from carts where user_id = auth.uid())
    );

-- Orders: users see own orders
create policy "Users view own orders"
    on orders for select
    using (auth.uid() = user_id);

-- Orders: admins see all orders
create policy "Admins view all orders"
    on orders for select
    using (public.is_admin());

-- Orders: admins can update order status
create policy "Admins update orders"
    on orders for update
    using (public.is_admin());

-- Orders: service role inserts (from API routes)
create policy "Service can insert orders"
    on orders for insert
    with check (auth.uid() = user_id);

-- Order items: users see own order items
create policy "Users view own order items"
    on order_items for select
    using (
        order_id in (select id from orders where user_id = auth.uid())
    );

-- Order items: admins see all order items
create policy "Admins view all order items"
    on order_items for select
    using (public.is_admin());

-- Order items: insert with own order
create policy "Users insert own order items"
    on order_items for insert
    with check (
        order_id in (select id from orders where user_id = auth.uid())
    );

-- ─── Trigger: auto-update updated_at ────────

create or replace function update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_carts_updated
    before update on carts
    for each row execute function update_updated_at();

create trigger trg_orders_updated
    before update on orders
    for each row execute function update_updated_at();
