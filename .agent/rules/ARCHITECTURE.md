# Architecture & Coding Patterns

## 🏗 Architecture Patterns
### 1. Atomic Design
Organize components in `src/components/`:
- **atoms**: Buttons, Inputs (Generic, no logic).
- **molecules**: SearchBar, UserCard (Simple logic, UI combinations).
- **organisms**: `AppointmentsTable`, `SidebarContainer` (Complex business logic).

### 2. Provider Pattern
Global state is managed via Providers in `src/providers/`:
- **`AdminProvider`**: Manages auth session (`user`, `profile`) and prevents race conditions.
- **`AdminUIProvider`**: Manages global UI state like the Generic Sidebar (`isOpen`, `view`, `data`).

### 3. Sidebar System
Do **NOT** use local state for global sidebars. Use the generic system:
```tsx
const { openSidebar } = useSidebar();
// Open 'appointment_details' view
openSidebar("appointment_details", { appointment: apt });
// Open 'settings' view
openSidebar("settings");
```

## 📝 Coding Conventions
- **Class Merging**: Always use `cn()` for combining Tailwind classes. \`className={cn("base-class", className)}\`
- **Imports**: Use `@/` alias for root imports.
- **Async/Await**: Prefer `async/await` over `.then()`.
- **Dates**: Use `date-fns` for all formatting. Example: `format(date, "PPP", { locale: es })`.
- **Types**: Define interfaces in `src/types/index.ts`. Avoid `any`.
