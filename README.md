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

- **`main`**: Production branch. Linked to the `Peluqueria-Prod` project in Supabase.
- **`develop`**: Development branch. Linked to the `Peluqueria-Dev` project in Supabase.

### 🔄 Multi-Environment Workflow

We use separate Supabase projects for **Production** and **Development**. To switch between them locally:

1. **Populate Environment Files**:
   Create these two files in the root directory (gitignored):
   - `.env.prod`: Contiene `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` de PRODUCCIÓN.
   - `.env.dev`: Contiene las mismas variables de DESARROLLO.

2. **Switch Environment**:
   Run the following command to link the Supabase CLI **and** update your `.env.local` automatically:
   ```bash
   npm run dbenv dev  # Cambiar a Desarrollo
   npm run dbenv prod # Cambiar a Producción
   ```

2. **Sync Schemas (Migrations)**:
   After switching to the desired environment, push your local migrations to the cloud project:
   ```bash
   npx supabase db push
   ```

3. **Populate Test Data (Seeds)**:
   Since we are not using Docker, `npx supabase db reset --seed` is not available. To load test data (appointments, services, test profiles):
   - Open `supabase/seed.sql` and copy its content.
   - Go to the **SQL Editor** in your Supabase Dashboard and run the script.
   *Note: Real auth users must be created manually in the dashboard or via the app sign-up flow.*

### 🔑 Creating Admin Users

Since roles are managed in the `public.profiles` table, follow these steps to create an administrator:

1. **Create the user**: Go to **Authentication > Users** in your Supabase Dashboard and create a new user.
2. **Copy the UID**: Copy the `User UID` (UUID) of the newly created user.
3. **Elevate to Admin**: Go to the **SQL Editor** and run the following query:
   ```sql
   INSERT INTO public.profiles (id, full_name, role)
   VALUES ('PASTE_USER_UID_HERE', 'Admin Name', 'admin')
   ON CONFLICT (id) DO UPDATE SET role = 'admin';
   ```

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
