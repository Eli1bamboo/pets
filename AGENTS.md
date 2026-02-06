# AGENTS.md

> **Context**: Dog Grooming Appointment System ("Peluquería Canina").
> **Goal**: Manage appointments, customers, and business settings for a dog grooming business.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS (with `cn` utility)
- **Database/Auth**: Supabase
- **State Management**: React Context (`AdminProvider`, `AdminUIProvider`) + Custom Hooks
- **Date Handling**: `date-fns` (Locale: `es`)
- **Icons**: `lucide-react`

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

## ⚙️ Development Workflow
### Commands
- **Start Dev Server**: `npm run dev`
- **Build & Verify**: `npm run build` (Run this **ALWAYS** before finishing a task involving code changes).
- **Lint**: `npm run lint`

### Version Control (GitHub Flow)
1.  **Main Branches**:
    - `main`: Production-ready code.
    - `develop`: Integration branch for ongoing work.
2.  **Feature Branches**:
    - Format: `feature/short-description` or `fix/issue-description`.
    - Create off `develop`.
3.  **Checkin Process**:
    - Commit format: `type: summary` (e.g., `feat: add sidebar`, `fix: login race condition`).
    - Push to origin and create Pull Request to `develop`.
    - **Merge Strategy**: Merge `develop` into `main` for releases.

### Credentials
- **Test Users**: See `TEST_CREDENTIALS.md` in the root.
- **Mock Data**: Use `mock_history_data.sql` for generating test scenarios. **Critical**: Use valid statuses ('completed', 'cancelled', 'pending', 'ready').

## 🛡 Verification Checklist
Before finishing a task:
1.  **Build Check**: Does `npm run build` pass?
2.  **Lint Check**: Are there new lint errors?
3.  **Visual Check**: Did you verify the UI changes?
4.  **Consistency**: Did you follow the `useSidebar` pattern?
