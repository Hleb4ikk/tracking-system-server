CREATE TABLE IF NOT EXISTS supply_node_connections(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_node_id UUID NOT NULL,
    destination_node_id UUID NOT NULL,
    supply_chain_id UUID NOT NULL,
    distance DECIMAL NOT NULL,

    CONSTRAINT fk_start_node FOREIGN KEY (start_node_id) REFERENCES supply_nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_destination_node FOREIGN KEY (destination_node_id) REFERENCES supply_nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_supply_chain FOREIGN KEY (supply_chain_id) REFERENCES supply_chains(id) ON DELETE CASCADE,
        
    CONSTRAINT uq_supply_nodes_chain UNIQUE (start_node_id, destination_node_id, supply_chain_id)
);
