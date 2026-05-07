import { SupplyGraph } from 'src/classes/SupplyChainGraph';
import { SupplyNodeConnection } from './SupplyNodeConnection';

export interface SupplyChain {
  id: string;
  title: string;
  description: string | null;
  company_id: string;
}

export interface SupplyChainWithConnections extends SupplyChain {
  supply_node_connections: SupplyNodeConnection[];
}
export interface SupplyChainWithGraph extends SupplyChain {
  supplyGraph: SupplyGraph;
}
