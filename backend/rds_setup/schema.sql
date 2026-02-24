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

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(project_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- INSERT INTO admins (username, password_hash) 
-- VALUES (
--   'admin@nirveena', 
--   '$2b$10$/sLv8DenRm7d6jleukdxmubKZUtlnDjpf06h/1BRLnIWwQxtcJtm2'
-- ) ON CONFLICT (username) DO NOTHING;