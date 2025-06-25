export interface CustomerState {
  customers: Customer[];
  HeadersCustomer: HeaderCustomer[];
  loading: boolean;
  hasSaved: boolean;
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
}

export interface HeaderCustomer {
  title: string;
  key: string;
  value?: string | ((item: any) => any);
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export const HeadersCustomer: HeaderCustomer[] = [
    { title: 'Customer Name', align: 'start', key: 'customer_name' },
    { title: 'Type', align: 'start', key: 'type' },
    { title: 'NIK', align: 'start', key: 'nik' },
    { title: 'E-mail', align: 'start', key: 'email' },
    { title: 'Address', align: 'start', key: 'address' },
    { title: 'Handphone', align: 'center', key: 'phone'},
    { title: 'Status', align: 'start', key: 'active_flag'},
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
]
