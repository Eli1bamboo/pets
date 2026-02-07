-- Enable Realtime for appointments and appointment_logs
begin;
  -- remove if exists to avoid error, or just add. 
  -- "supabase_realtime" publication exists by default in Supabase.
  alter publication supabase_realtime add table appointments;
  alter publication supabase_realtime add table appointment_logs;
commit;
