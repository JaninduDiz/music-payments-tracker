# Music Payments Tracker

This is a web application designed to help families or groups manage and track shared music lesson payments. It provides a clear overview of who has paid, who is behind, and the total outstanding balance.

## ✨ Features

- **Member Management:** Add, edit, and manage members, including their monthly payment amounts.
- **Payment Tracking:** Log payments for each member with specific dates.
- **Balance Overview:** A dashboard that shows each member's payment status (paid, pending, or ahead) and the total outstanding balance for the group.
- **Monthly Views:** Easily navigate between different months to see historical balance information.
- **Responsive Design:** A mobile-first design that works beautifully on all devices.
- **Persistent Storage:** All data is stored in your own Supabase project.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **UI:** [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **Database:** [Supabase](https://supabase.io/)
- **AI:** [Genkit](https://firebase.google.com/docs/genkit)
- **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🛠️ Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.io/) account and project.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
   Create a file named `.env.local` in the root of your project and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. **Set up Supabase tables:**
   In your Supabase project dashboard, go to the `SQL Editor` and run the following queries to create the necessary tables.

   **Members Table:**
   ```sql
   CREATE TABLE public.members (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       "createdAt" TIMESTAMPTZ DEFAULT now() NOT NULL,
       name TEXT NOT NULL,
       "monthlyAmount" NUMERIC NOT NULL,
       "isActive" BOOLEAN DEFAULT true NOT NULL
   );
   ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Enable read access for all users" ON public.members FOR SELECT USING (true);
   CREATE POLICY "Enable insert for authenticated users only" ON public.members FOR INSERT WITH CHECK (true);
   CREATE POLICY "Enable update for users based on user_id" ON public.members FOR UPDATE USING (true) WITH CHECK (true);
   CREATE POLICY "Enable delete for users based on user_id" ON public.members FOR DELETE USING (true);
   ```

   **Payments Table:**
   ```sql
    CREATE TABLE public.payments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        "memberId" UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
        amount NUMERIC NOT NULL,
        date TIMESTAMPTZ NOT NULL
    );
   ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Enable read access for all users" ON public.payments FOR SELECT USING (true);
   CREATE POLICY "Enable insert for authenticated users only" ON public.payments FOR INSERT WITH CHECK (true);
   CREATE POLICY "Enable update for users based on user_id" ON public.payments FOR UPDATE USING (true) WITH CHECK (true);
   CREATE POLICY "Enable delete for users based on user_id" ON public.payments FOR DELETE USING (true);
   ```

### Running the Development Server

To start the app in development mode, run:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
