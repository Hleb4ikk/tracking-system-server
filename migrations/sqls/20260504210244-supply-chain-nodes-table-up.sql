CREATE TABLE IF NOT EXISTS supply_nodes(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description VARCHAR,
    country VARCHAR NOT NULL,
    zip VARCHAR NOT NULL,
    region VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    address_line VARCHAR NOT NULL,
    company_id UUID NOT NULL,

    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);