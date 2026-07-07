/*
# BharatSathi AI - Full Schema

1. New Tables
  - `profiles` - User profiles linked to auth.users
    - id, user_id, full_name, email, phone, state, occupation, income_range, age, gender, language, avatar_url, created_at, updated_at
  - `complaints` - Civic complaints registered by users
    - id, user_id, title, description, category, status, location, images, created_at, updated_at
  - `complaint_updates` - Timeline updates for complaints
    - id, complaint_id, status, message, created_at
  - `saved_schemes` - Schemes saved by users
    - id, user_id, scheme_id, scheme_name, scheme_category, scheme_description, created_at
  - `chat_history` - AI chat sessions
    - id, user_id, session_id, role, content, language, created_at
  - `notifications` - User notifications
    - id, user_id, title, message, type, read, created_at

2. Security
  - RLS enabled on all tables
  - Authenticated users can only access their own data
  - user_id defaults to auth.uid() for all tables
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  state text DEFAULT 'Maharashtra',
  occupation text DEFAULT 'Other',
  income_range text DEFAULT 'Below 1 Lakh',
  age integer DEFAULT 25,
  gender text DEFAULT 'Male',
  language text DEFAULT 'en',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Roads',
  status text NOT NULL DEFAULT 'Pending',
  location text,
  priority text DEFAULT 'Medium',
  ticket_number text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_complaints" ON complaints;
CREATE POLICY "select_own_complaints" ON complaints FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_complaints" ON complaints;
CREATE POLICY "insert_own_complaints" ON complaints FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_complaints" ON complaints;
CREATE POLICY "update_own_complaints" ON complaints FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_complaints" ON complaints;
CREATE POLICY "delete_own_complaints" ON complaints FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Complaint updates (timeline)
CREATE TABLE IF NOT EXISTS complaint_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  status text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_complaint_updates" ON complaint_updates;
CREATE POLICY "select_complaint_updates" ON complaint_updates FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM complaints
      WHERE complaints.id = complaint_updates.complaint_id
      AND complaints.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_complaint_updates" ON complaint_updates;
CREATE POLICY "insert_complaint_updates" ON complaint_updates FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM complaints
      WHERE complaints.id = complaint_updates.complaint_id
      AND complaints.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "update_complaint_updates" ON complaint_updates;
CREATE POLICY "update_complaint_updates" ON complaint_updates FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM complaints
      WHERE complaints.id = complaint_updates.complaint_id
      AND complaints.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "delete_complaint_updates" ON complaint_updates;
CREATE POLICY "delete_complaint_updates" ON complaint_updates FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM complaints
      WHERE complaints.id = complaint_updates.complaint_id
      AND complaints.user_id = auth.uid()
    )
  );

-- Saved schemes
CREATE TABLE IF NOT EXISTS saved_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id text NOT NULL,
  scheme_name text NOT NULL,
  scheme_category text NOT NULL,
  scheme_description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_schemes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved_schemes" ON saved_schemes;
CREATE POLICY "select_own_saved_schemes" ON saved_schemes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_schemes" ON saved_schemes;
CREATE POLICY "insert_own_saved_schemes" ON saved_schemes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_saved_schemes" ON saved_schemes;
CREATE POLICY "update_own_saved_schemes" ON saved_schemes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_schemes" ON saved_schemes;
CREATE POLICY "delete_own_saved_schemes" ON saved_schemes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Chat history
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  language text DEFAULT 'en',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_chat" ON chat_history;
CREATE POLICY "select_own_chat" ON chat_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_chat" ON chat_history;
CREATE POLICY "insert_own_chat" ON chat_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_chat" ON chat_history;
CREATE POLICY "update_own_chat" ON chat_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_chat" ON chat_history;
CREATE POLICY "delete_own_chat" ON chat_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaint_updates_complaint_id ON complaint_updates(complaint_id);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_user_id ON saved_schemes(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
