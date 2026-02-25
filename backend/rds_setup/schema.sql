CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  project_id INTEGER UNIQUE NOT NULL,
  project_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  project_type TEXT,
  project_status TEXT,
  project_location TEXT,

  total_acres NUMERIC,
  no_of_units INTEGER,
  club_house_size TEXT,
  structure TEXT,

  typology TEXT,
  sba TEXT,
  price TEXT,
  rera_completion TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INSERT INTO admins (username, password_hash) 
-- VALUES (
--   'admin@nirveena', 
--   '$2b$10$/sLv8DenRm7d6jleukdxmubKZUtlnDjpf06h/1BRLnIWwQxtcJtm2'
-- ) ON CONFLICT (username) DO NOTHING;

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- ENQUIRIES TABLE
-- ===============================

CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inbound_leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  property_type VARCHAR(50),
  budget VARCHAR(50),
  status VARCHAR(20) DEFAULT 'new',
  notes TEXT,
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMP WITH TIME ZONE,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_leads_status ON inbound_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON inbound_leads(created_at);



-- Fix customers table
ALTER TABLE customers 
ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE 
USING created_at AT TIME ZONE 'Asia/Kolkata';

-- Fix enquiries table
ALTER TABLE enquiries 
ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE 
USING created_at AT TIME ZONE 'Asia/Kolkata';