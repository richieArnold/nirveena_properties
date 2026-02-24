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

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    contact VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- ENQUIRIES TABLE
-- ===============================

CREATE TABLE IF NOT EXISTS enquiries (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);