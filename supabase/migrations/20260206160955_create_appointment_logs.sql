CREATE TABLE IF NOT EXISTS public.appointment_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_id BIGINT REFERENCES public.appointments(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.appointment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view logs of their own appointments"
ON public.appointment_logs
FOR SELECT
USING (
    exists (
        select 1 from public.appointments a
        where a.id = appointment_logs.appointment_id
        and a.user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all logs"
ON public.appointment_logs
FOR SELECT
TO authenticated
USING (
    exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    )
);

CREATE POLICY "Admins can insert logs"
ON public.appointment_logs
FOR INSERT
TO authenticated
WITH CHECK (
    exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    )
);
