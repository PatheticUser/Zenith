-- Disable RLS on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to all roles
GRANT ALL PRIVILEGES ON TABLE profiles TO authenticated;
GRANT ALL PRIVILEGES ON TABLE profiles TO anon;
GRANT ALL PRIVILEGES ON TABLE profiles TO service_role;

GRANT ALL PRIVILEGES ON TABLE projects TO authenticated;
GRANT ALL PRIVILEGES ON TABLE projects TO anon;
GRANT ALL PRIVILEGES ON TABLE projects TO service_role;

GRANT ALL PRIVILEGES ON TABLE tasks TO authenticated;
GRANT ALL PRIVILEGES ON TABLE tasks TO anon;
GRANT ALL PRIVILEGES ON TABLE tasks TO service_role;

GRANT ALL PRIVILEGES ON TABLE progress_logs TO authenticated;
GRANT ALL PRIVILEGES ON TABLE progress_logs TO anon;
GRANT ALL PRIVILEGES ON TABLE progress_logs TO service_role;

-- Fix the trigger function for creating profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  retries INTEGER := 5;
BEGIN
  -- Add a retry mechanism to handle potential timing issues
  WHILE retries > 0 LOOP
    BEGIN
      INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at)
      VALUES (
        NEW.id,
        split_part(NEW.email, '@', 1),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NULL,
        NOW(),
        NOW()
      );
      
      -- If we get here, the insert succeeded
      RETURN NEW;
    EXCEPTION WHEN foreign_key_violation THEN
      -- If we hit a foreign key violation, wait a bit and retry
      retries := retries - 1;
      IF retries = 0 THEN
        RAISE EXCEPTION 'Failed to create profile after multiple attempts';
      END IF;
      PERFORM pg_sleep(0.5); -- Wait 500ms before retrying
    END;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
