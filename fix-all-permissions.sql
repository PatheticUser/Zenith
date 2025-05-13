-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to authenticated and anon users
GRANT ALL PRIVILEGES ON TABLE profiles TO authenticated;
GRANT ALL PRIVILEGES ON TABLE profiles TO anon;
GRANT ALL PRIVILEGES ON TABLE projects TO authenticated;
GRANT ALL PRIVILEGES ON TABLE projects TO anon;
GRANT ALL PRIVILEGES ON TABLE tasks TO authenticated;
GRANT ALL PRIVILEGES ON TABLE tasks TO anon;
GRANT ALL PRIVILEGES ON TABLE progress_logs TO authenticated;
GRANT ALL PRIVILEGES ON TABLE progress_logs TO anon;

-- Make sure the trigger function for creating profiles works
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    split_part(NEW.email, '@', 1),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NULL,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- Add this to prevent duplicate key errors
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
