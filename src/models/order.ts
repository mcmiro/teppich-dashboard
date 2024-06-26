import { PropductModel } from './product';
export interface OrderDataModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  number: string;
  postal_code: number;
  town: string;
  products: PropductModel[];
  summ: number;
  status: string;
  created_at: string;
  updated_at: string;
}
