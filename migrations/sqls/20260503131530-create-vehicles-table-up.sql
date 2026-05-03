CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    delivery_type VARCHAR NOT NULL,
    company_id UUID NOT NULL,

    CONSTRAINT check_delivery_type CHECK(delivery_type IN ('land', 'water', 'air')),
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);