export interface AssetState {
  assets: Asset[];
  owners: Owner[];
  headerAsset: HeaderAsset[];
  headerOwner: HeaderOwner[];
  loading: boolean;
  hasSaved: boolean;
  selectedAsset: Asset[] | null;
}

type AssetKey = keyof Asset;

export interface AssetField {
  model: AssetKey;
  label: string;
  items?: {id: number, name: string}[];
  itemTitle?: string;
  itemValue?: string;
  onEnterSubmit?: boolean;
}

export interface Asset {
  id: number | string;
  owner_name: string;
  asset_name: string;
  quantity: number;
  cogs: number;
  selling_price: number;
  description: string;
  created_by: number | string;
}

export interface Owner {
  id: number | string;
  name: string;
  active_flag: boolean;
  inactive_date: string;
}

export interface RawOwner {
  id: number | string;
  name: string;
  active_flag: string;
  inactive_date: string;
}

export interface RawAsset {
  id: number | string;
  owner_name: string;
  asset_name: string;
  quantity: number;
  cogs: number;
  selling_price: number;
  description: string;
  created_by: number | string;
}

export interface HeaderAsset {
  title: string;
  key: string;
  value?: string | ((item: Asset) => string | number | boolean);
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export interface HeaderOwner {
  title: string;
  key: string;
  value?: string | ((item: Owner) => string | boolean);
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

export const headerOwner: HeaderOwner[] = [
    { title: 'Owner Name', align: 'start', key: 'name' },
    { title: 'Active Flag', align: 'start', key: 'active_flag' },
    { title: 'Inactive Date', align: 'start', key: 'inactive_date' },
    { title: 'Actions', align: 'center', key: 'actions', sortable: false },
]