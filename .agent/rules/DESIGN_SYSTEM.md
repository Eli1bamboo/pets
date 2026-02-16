# Design System

> Defined from Figma specification. All UI changes must adhere to these tokens.

## Contexts
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

## Colors
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

## Typography
- **Font Family**: `Poppins` (Google Font).
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700).
- **Type Scale**: Follow standard Tailwind `text-xs` to `text-4xl`.

## Spacing & Grid
- **Spacing Scale**: 4px (`gap-1`), 8px (`gap-2`), 16px (`gap-4`), 24px (`gap-6`), 32px (`gap-8`), 40px (`gap-10`).
- **Containers**: Use fixed containers for content (`max-w-7xl px-4 sm:px-6`).

## Effects & Shape
- **Radius**: Heavy usage of rounded corners.
  - Cards/Containers: `rounded-2xl` (2rem) or `rounded-3xl` (2.5rem).
  - Buttons: `rounded-xl` or `rounded-full`.
- **Shadows**: Soft, diffused shadows on white cards (`shadow-lg` or `shadow-xl`).

## Component Patterns
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
