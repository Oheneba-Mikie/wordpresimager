-- Create WordPress connections table
CREATE TABLE IF NOT EXISTS wordpress_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  site_url TEXT NOT NULL DEFAULT 'https://wordpress.example.com',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime
alter publication supabase_realtime add table wordpress_connections;
