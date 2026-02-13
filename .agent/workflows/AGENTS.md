# AGENTS.md

> **Context**: Dog Grooming Appointment System ("Peluquería Canina").
> **Goal**: Manage appointments, customers, and business settings for a dog grooming business.

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (with `cn` utility)
- **Database/Auth**: Supabase
- **State Management**: React Context (`AdminProvider`, `AdminUIProvider`) + Custom Hooks
- **Date Handling**: `date-fns` (Locale: `es`)
- **Internationalization**: Custom lightweight i18n (`src/i18n`).
- **Icons**: `lucide-react` (Equivalent to Feather Icons)

## 🌍 Internationalization (i18n)
- **Status**: Implemented with custom Context + LocalStorage.
- **Languages**: `es` (Spanish - Default), `en` (English).
- **Files**:
  - `src/i18n/locales/es.ts`: Source of truth for texts.
  - `src/i18n/locales/en.ts`: English translations.
- **Pattern**:
  ```tsx
  const { t, language, setLanguage } = useTranslation();
  <p>{t.common.welcome}</p>
  ```

## 🎨 Design System
> Defined from Figma specification. All UI changes must adhere to these tokens.

### Contexts
**1. Customer App (Playful & Warm)**
- **Role**: Client facing, booking, pet profile.
- **Palette**: `brand-` scale (Orange/Peach).
- **Vibe**: Friendly, Round, Soft.
- **Primary**: `brand-500`.

**2. Admin Dashboard (Serious & Data-Rich)**
- **Role**: Business management, tables, data.
- **Palette**: `slate-` or `gray-` scale (Muted).
- **Vibe**: Professional, Dense, Clean.
- **Primary**: `slate-900` or `brand-900`.
- **Accent**: `brand-600` (Used sparsely).

### Colors
**Brand Palette (Orange & Brown - Customer Primary)**
- `brand-50`: `#FDE9DA`
- `brand-100`: `#FCDBC1`
- `brand-200`: `#FAC9A2`
- `brand-300`: `#F8B683`
- `brand-400`: `#F7A464`
- `brand-500`: `#F59245` **(Main Brand Color)**
- `brand-600`: `#CC7A3A`
- `brand-700`: `#A3612E`
- `brand-800`: `#7B4923`
- `brand-900`: `#523117`
- `brand-950`: `#311D0E`

**Admin Palette (Muted)**
- **Background**: `bg-slate-50` or `bg-white`.
- **Text**: `text-slate-900` (Primary), `text-slate-500` (Secondary).
- **Borders**: `border-slate-200`.

**Neutrals**
- Use standard Tailwind `gray-` scale (slate/zinc) or specific values if provided.
- `bg-cream`: `#FDFFFC` (or `brand-50` for warmer backgrounds).

### Typography
- **Font Family**: `Poppins` (Google Font).
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700).
- **Type Scale**: Follow standard Tailwind `text-xs` to `text-4xl`.

### Spacing & Grid
- **Spacing Scale**: 4px (`gap-1`), 8px (`gap-2`), 16px (`gap-4`), 24px (`gap-6`), 32px (`gap-8`), 40px (`gap-10`).
- **Containers**: Use fixed containers for content (`max-w-7xl px-4 sm:px-6`).

### Effects & Shape
- **Radius**: Heavy usage of rounded corners.
  - Cards/Containers: `rounded-2xl` (2rem) or `rounded-3xl` (2.5rem).
  - Buttons: `rounded-xl` or `rounded-full`.
- **Shadows**: Soft, diffused shadows on white cards (`shadow-lg` or `shadow-xl`).

### Component Patterns
- **Buttons**:
  - **Primary**: `bg-brand-500` text-white. Hover: `bg-brand-800` (Dark Brown/Orange).
  - **Disabled**: `bg-brand-100` (Peach) text-brand-300.
  - **Shape**: Pill-shaped or highly rounded rectangles.
- **Navigation (Mobile)**:
  - Bottom Tab Bar with icons.
  - **Active**: Icon & Text in `brand-500`.
  - **Inactive**: Gray.
  - **Central Action**: Floating Action Button (FAB) style (Circle, `bg-brand-500`, White Icon).
- **Cards**:
  - **Standard**: White background (`bg-white`), heavy radius (`rounded-3xl`), soft diffused shadow.
  - **List Item**: Row layout with icon on left (often in `bg-brand-50` container) and text on right.
  - **Profile**: Includes Avatar (rounded or square) with text hierarchy (Name in `brand-900`, Role/Detail in `gray-500` or `brand-400`).
  - **Highlight**: Optional thick border (`border-4 border-brand-500`) for emphasis.
- **Form Elements**:
  - **Inputs**: `rounded-xl` border `brand-200` (soft peach). Focus: `ring-brand-500`.
  - **Checkbox**: Rounded square `rounded-md`. Checked: `bg-brand-500`.
  - **Radio**: Circle. Selected: Concentric circles in `brand-500`.
- **Tabs**:
  - **Style**: Pill-shaped (`rounded-full`).
  - **Active**: Solid Orange (`bg-brand-500` text-white).
  - **Inactive**: Outlined (`border border-brand-300` text-brand-900).

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
- **Supabase Client**: Must be a **Singleton** on the client side to ensure `onAuthStateChange` events are caught by all listeners (Providers, Hooks). Do NOT create new client instances.

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
    - **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
    - **Scopes**: Do NOT use scopes. Keep it simple.
    - **Push/Merge Policy**: Do NOT push to origin or merge branches automatically. Wait for explicit user instruction (e.g., "Push changes", "Merge PR").
    - **Merge Strategy**: Merge `develop` into `main` only on approval.

### Credentials
- **Test Users**: See `TEST_CREDENTIALS.md` (Note: This file is `.gitignored` to protect sensitive data).
- **Mock Data**: Use `mock_history_data.sql` for generating test scenarios. **Critical**: Use valid statuses ('completed', 'cancelled', 'pending', 'ready').

## 🛡 Verification Checklist
Before finishing a task:
1.  **Build Check**: Does `npm run build` pass?
2.  **Lint Check**: Are there new lint errors?
3.  **Visual Check**: Did you verify the UI changes?
4.  **Consistency**: Did you follow the `useSidebar` pattern?
