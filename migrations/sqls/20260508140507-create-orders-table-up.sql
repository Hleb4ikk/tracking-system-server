CREATE TABLE IF NOT EXISTS orders (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    description VARCHAR,
    company_id UUID NOT NULL,
    responsible_id UUID NOT NULL,
    reciever_id UUID NOT NULL,

    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (responsible_id) REFERENCES users(id),
    CONSTRAINT fk_reciever FOREIGN KEY (reciever_id) REFERENCES recievers(id)

);