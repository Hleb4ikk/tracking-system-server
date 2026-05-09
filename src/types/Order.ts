export interface Order {
  id: string;
  title: string;
  status: string;
  description: string | null;
  company_id: string;
  responsible_id: string;
  reciever_id: string;
}

export interface StatusHistory {
  id: string;
  title: string;
  created_at: Date;
  company_id: string;
  order_id: string;
}

export interface OrderWithHistory extends Order {
  status_history: StatusHistory[];
}
