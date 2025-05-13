-- Create stored procedure for inserting a profile
CREATE OR REPLACE FUNCTION insert_profile(
  p_id UUID,
  p_full_name TEXT,
  p_username TEXT,
  p_avatar_url TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO profiles (id, full_name, username, avatar_url, created_at, updated_at)
  VALUES (p_id, p_full_name, p_username, p_avatar_url, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create stored procedure for updating a profile
CREATE OR REPLACE FUNCTION update_profile(
  p_id UUID,
  p_full_name TEXT,
  p_username TEXT,
  p_avatar_url TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET 
    full_name = p_full_name,
    username = p_username,
    avatar_url = p_avatar_url,
    updated_at = NOW()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create stored procedure for inserting a project
CREATE OR REPLACE FUNCTION insert_project(
  p_user_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_due_date TIMESTAMP WITH TIME ZONE,
  p_color TEXT
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO projects (
    user_id, title, description, start_date, due_date, 
    completed, color, created_at, updated_at
  )
  VALUES (
    p_user_id, p_title, p_description, p_start_date, p_due_date, 
    FALSE, p_color, NOW(), NOW()
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create stored procedure for inserting a task
CREATE OR REPLACE FUNCTION insert_task(
  p_user_id UUID,
  p_project_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_due_date TIMESTAMP WITH TIME ZONE,
  p_priority TEXT,
  p_is_recurring BOOLEAN,
  p_recurrence_pattern TEXT
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO tasks (
    user_id, project_id, title, description, due_date, 
    priority, status, is_recurring, recurrence_pattern, 
    created_at, updated_at
  )
  VALUES (
    p_user_id, p_project_id, p_title, p_description, p_due_date, 
    p_priority, 'todo', p_is_recurring, p_recurrence_pattern, 
    NOW(), NOW()
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
