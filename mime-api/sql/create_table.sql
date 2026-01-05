CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  apellido VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  empresa VARCHAR(120),
  cargo VARCHAR(120),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip VARCHAR(64),
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
