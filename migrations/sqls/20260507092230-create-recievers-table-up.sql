CREATE TABLE IF NOT EXISTS recievers(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE
);