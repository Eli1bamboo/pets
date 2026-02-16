# Tech Stack & Internationalization

## 🛠 Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (with `cn` utility)
- **Database/Auth**: Supabase
- **State Management**: React Context (`AdminProvider`, `AdminUIProvider`) + Custom Hooks
- **Date Handling**: `date-fns` (Locale: `es`)
- **Internationalization**: Custom lightweight i18n (`src/i18n`).
- **Testing**: Vitest + React Testing Library.
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
