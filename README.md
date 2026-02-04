# 🐾 Peluquería Canina | Premium Pet Care

This is a modern and premium application for pet grooming management, designed to offer the best experience for both pet owners and administrators.

## 🚀 Key Technologies

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## ✨ Features

- **Premium Design**: Modern interface with a friendly aesthetic, high-quality imagery, and rounded corners throughout.
- **Appointment Booking**: Intuitive step-by-step booking flow to select services, dates, and times.
- **Live Tracking**: Real-time status tracker for pet owners to see their pet's progress (Washing, Drying, Ready, etc.).
- **Admin Dashboard**: Full management system for appointments, business hours, and shop settings.
- **Security**: Robust authentication and Row Level Security (RLS) implementation on Supabase.

## 🛠️ Workflow (Git)

We maintain an organized workflow to ensure stability:

- **`main`**: Production branch. Contains only stable and tested code ready for release.
- **`develop`**: Primary development branch. This is where new features and fixes are integrated before moving to production.

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📄 License

This project is licensed under the MIT License.
