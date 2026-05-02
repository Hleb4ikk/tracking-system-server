CREATE TABLE invitations(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    reciever_email VARCHAR NOT NULL,
    created_by UUID NOT NULL,
    role VARCHAR NOT NULL,
    days_to_delete SMALLINT NOT NULL DEFAULT 1,

    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT check_role_type CHECK(role IN ('co-founder', 'logistician', 'expeditor', 'сourier'))
);