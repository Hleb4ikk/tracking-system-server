CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR UNIQUE NOT NULL,
    description VARCHAR
);