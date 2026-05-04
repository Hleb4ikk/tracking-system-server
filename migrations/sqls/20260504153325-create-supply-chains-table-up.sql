CREATE TABLE supply_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid();
    title VARCHAR NOT NULL,
    description VARCHAR,
    company_id UUID NOT NULL,

    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);