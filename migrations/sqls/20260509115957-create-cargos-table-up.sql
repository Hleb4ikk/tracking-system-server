CREATE TABLE cargos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description VARCHAR,
    supply_node_connection_id UUID NOT NULL,
    status VARCHAR NOT NULL,
    vehicle_id UUID NOT NULL,
    order_id UUID NOT NULL,
    responsible_id UUID NOT NULL,
    company_id UUID NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_responsible FOREIGN KEY (responsible_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_supply_node_connections FOREIGN KEY (supply_node_connection_id) REFERENCES supply_node_connections(id) ON DELETE RESTRICT,
    CONSTRAINT check_status CHECK(status IN ('assembly', 'on the way', 'delayed', 'delivered'))
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cargos_updated_at
    BEFORE UPDATE ON cargos
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();