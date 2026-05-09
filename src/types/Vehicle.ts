import { DeliveryType } from 'src/enums/DeliveryType';

export interface Vehicle {
  id: string;
  title: string;
  delivery_type: DeliveryType;
  company_id: string;
  cargo_id: string | null;
}
