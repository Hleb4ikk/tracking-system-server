import { SupplyNode } from './SupplyNode';

export interface SupplyNodeConnection {
  id: string;
  start_node: SupplyNode;
  destination_node: SupplyNode;
  supply_chain_id: string;
  distance: number;
}
