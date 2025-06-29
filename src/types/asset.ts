export interface AssetState {
  assets: Asset[];
  owners: Owner[];
  headerAsset: HeaderAsset[];
  loading: boolean;
  hasSaved: boolean;
}

type AssetKey = keyof Asset;

export interface AssetField {
  model: AssetKey;
  label: string;
  items?: any[];          // Optional
  itemTitle?: string;     // Optional
  itemValue?: string;     // Optional
  onEnterSubmit?: boolean;
}

export interface Asset {
  id: number | string;
  customer_name: string;
  type: string;
  nik: string;
  email: string;
  address: string;
  phone: string;
  active_flag: boolean;
}

export interface Owner {
  id: number | string;
  name: string;
  active_flag: boolean;
  inactive_date: string;
}

export interface HeaderAsset {
  title: string;
  key: string;
  value?: string | ((item: any) => any);
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export const headerAsset: HeaderAsset[] = [
    { title: 'Customer Name', align: 'start', key: 'customer_name' },
    { title: 'Type', align: 'start', key: 'type' },
    { title: 'NIK', align: 'start', key: 'nik' },
    { title: 'E-mail', align: 'start', key: 'email' },
    { title: 'Address', align: 'start', key: 'address' },
    { title: 'Handphone', align: 'center', key: 'phone'},
    { title: 'Status', align: 'start', key: 'active_flag'},
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
]
