# Architecture & Coding Patterns

## 🏗 Architecture Patterns

### 1. Feature Isolation (Critical)
Code is strictly separated into two domains to prevent logic leaks and regression:
- **`src/features/customer/`**: Public-facing app validation, booking flow, brand UI.
- **`src/features/admin/`**: Internal dashboard, CRUD operations, slate UI.
**Rule**: Customer code MUST NOT import from Admin, and vice-versa. Shared logic (types, utilities) goes in `src/types` or `src/utils`.

### 2. Atomic Design (Per-Feature)
Components are organized **within** their respective feature directories:
- **atoms**: Feature-specific base elements (e.g., `features/admin/components/atoms/Button`).
- **molecules**: Feature-specific combinations (e.g., `features/customer/components/molecules/DateSelector`).
- **organisms**: Complex business logic units (e.g., `features/admin/components/organisms/AppointmentsTable`).

### 3. Provider Pattern
- **`AdminProvider`**: Auth session for Admin only.
- **`AdminUIProvider`**: Global UI state (Sidebars) for Admin only.
- **`CustomerProvider`**: Auth and state for Customer app.

### 4. Hooks Strategy
Hooks are specialized by domain:
- **`features/customer/hooks/*`**: Read-only or user-specific actions (e.g., `useAppointments` filters by logged-in user).
- **`features/admin/hooks/*`**: Admin-privileged actions (e.g., `useAppointments` fetches all, supports strict filtering).
- **Shared Hooks**: Only generic utilities (e.g., `usePagination`, `useAuth` helpers) remain in `src/hooks`.

## 📝 Coding Conventions
- **Class Merging**: Always use `cn()` for combining Tailwind classes. \`className={cn("base-class", className)}\`
- **Imports**: Use `@/` alias for root imports.
- **Async/Await**: Prefer `async/await` over `.then()`.
- **Dates**: Use `date-fns` for all formatting. Example: `format(date, "PPP", { locale: es })`.
- **Types**: Define interfaces in `src/types/index.ts`. Avoid `any`.
