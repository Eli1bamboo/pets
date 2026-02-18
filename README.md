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
- **Cancellation Policy**: Flexible admin-configured cancellation window with automated customer-facing enforcement.

## �️ Project Structure & Routes

The application is strictly divided into two independent experiences using Next.js Route Groups.

### 🏠 Client Experience (Customer)
*Exclusively for pet owners.*
- `/`: **Home** Page (Hero, Services, and value prop).
- `/login`: **Access Portal** (Login & Registration for clients).
- `/booking`: **Appointment Booking** (Step-by-step flow).
- `/tracking`: **Live Tracker** (Progress monitor for pets).
- `/history`: **Appointment History** (Personal client record).
- `/profile`: **User Profile** (Personal data management).

### 👔 Internal Management (Admin)
*Restricted professional portal for business operations.*
- `/admin/login`: **Professional Login** (Specific access for business staff).
- `/admin`: **KPI Dashboard** (Business metrics, month summaries, revenue).
- `/admin/appointments`: **Live Management** (Real-time appointment status control).
- `/admin/history`: **Global History** (Full record of all business services).
- `/admin/settings`: **Shop Settings** (Configuration of hours and services).

## �🛠️ Workflow (Git)

We maintain an organized workflow to ensure stability:

- **`main`**: Production branch. Linked to the `Peluqueria-Prod` project in Supabase.
- **`develop`**: Development branch. Linked to the `Peluqueria-Dev` project in Supabase.

### 🔄 Multi-Environment Workflow

We use separate Supabase projects for **Production** and **Development**. **NEVER commit sensitive keys or IDs to the repository.**

1. **Local Setup**:
   Create these two files (gitignored) locally with your credentials:
   - `.env.prod`: Production project.
   - `.env.dev`: Development project.

   **Template for both files:**
   ```env
   # Your Supabase Project URL (The script extracts the ID from here automatically)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   # Your Supabase Anon Public Key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Switching Environments**:
   Run the following command to link the Supabase CLI **and** update your `.env.local` automatically based on the source files:
   ```bash
   npm run dbenv dev  # Switch to Development
   npm run dbenv prod # Switch to Production
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

If you are a new developer, follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd peluqueria_canina
   ```

2. **Required Files**:
   Since some configuration files are sensitive, they are not in the repository. Ask a team member for the `ignored_files.zip` and extract its content into the project root. This ZIP should contain:
   - `.env.dev`, `.env.local`, `.env.prod`
   - `TEST_CREDENTIALS.md`
   - `supabase/config.toml`

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start Supabase (if using local development)**:
   ```bash
   npx supabase start
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

### 🛠️ Common Commands

- `npm run dbenv dev`: Switch local environment to Development project.
- `npm run dbenv prod`: Switch local environment to Production project.
- `npx supabase db push`: Push your local migrations to the linked Supabase project.

## 📄 License

This project is licensed under the MIT License.
