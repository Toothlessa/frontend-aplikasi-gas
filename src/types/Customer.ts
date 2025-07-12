export interface CustomerState {
  customers: Customer[];
  headerCustomer: HeaderCustomer[];
  loading: boolean;
  hasSaved: boolean;
}

type CustomerKey = keyof Customer;

export interface CustomerField {
  model: CustomerKey;
  label: string;
  items?: string[];
  itemTitle?: string;
  itemValue?: string;
  onEnterSubmit?: boolean;
}

export interface Customer {
  id: number | string;
  customer_name: string;
  type: string;
  nik: string;
  email: string;
  address: string;
  phone: string;
  active_flag: boolean;
  in_stock: boolean;
}

export interface RawCustomer {
  id: number | string;
  customer_name: string;
  type: string;
  nik: string;
  email: string;
  address: string;
  phone: string;
  active_flag: string;
  in_stock: string;
}

export interface HeaderCustomer {
  title: string;
  key: string;
  value?: string | ((item: Customer) => string | boolean);
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export const headerCustomer: HeaderCustomer[] = [
    { title: 'Customer Name', align: 'start', key: 'customer_name' },
    { title: 'Type', align: 'start', key: 'type' },
    { title: 'NIK', align: 'start', key: 'nik' },
    { title: 'E-mail', align: 'start', key: 'email' },
    { title: 'Address', align: 'start', key: 'address' },
    { title: 'Handphone', align: 'center', key: 'phone'},
    { title: 'Status', align: 'start', key: 'active_flag'},
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
]
