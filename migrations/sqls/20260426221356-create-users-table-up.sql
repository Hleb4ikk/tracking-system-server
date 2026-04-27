CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    username VARCHAR(128) NOT NULL,
    hashed_password VARCHAR NOT NULL
);