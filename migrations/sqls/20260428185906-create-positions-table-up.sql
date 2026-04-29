CREATE TABLE IF NOT EXISTS positions (
    company_id UUID ,
    user_id UUID UNIQUE,
    role VARCHAR NOT NULL,

    PRIMARY KEY (company_id, user_id),

    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT check_role_type CHECK(role IN ('co-founder', 'logistician', 'expeditor', 'сourier'))
);