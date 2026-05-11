export type CargoStatus = 'assembly' | 'on the way' | 'delayed' | 'delivered';

export interface Cargo {
  id: string;
  title: string;
  description: string;
  supply_node_connection_id: string;
  status: CargoStatus;
  vehicle_id: string | null;
  order_id: string | null;
  responsible_id: string;
  company_id: string;
  created_at: Date;
  updated_at: Date;
}
