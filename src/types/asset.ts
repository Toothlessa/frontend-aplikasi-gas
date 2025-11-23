export interface AssetState {
  assets: Asset[];
  owners: Owner[];
  assetDetails: Asset[];
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
  id: number;
  owner_id: number;
  item_id: number;
  owner_name: string;
  item_name: string;
  quantity: number;
  cogs: number;
  selling_price: number;
  description: string;
  created_by: number | string;
}

export interface Owner {
  id: number ;
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
  owner_id: number;
  item_id: number;
  owner_name: string;
  item_name: string;
  quantity: number;
  cogs: number;
  selling_price: number;
  description: string;
  created_by: number | string;
}

export interface HeaderAsset {
  title: string;
  value?: string | ((item: Asset) => string | number | boolean);
  align?: 'start' | 'center' | 'end';
  class?: string;
  sortable?: boolean;
}

export interface HeaderOwner {
  title: string;
  key: string;
  //value?: string | ((item: Owner) => string | boolean);
  value?: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export const headerAsset: HeaderAsset[] = [
  { title: 'Name',      value: 'item_name',     sortable: true,   class: 'text-subtitle-1', align: 'start', },
  { title: 'Owner',     value: 'owner_name',    sortable: true,   class: 'text-subtitle-1', align: 'start',},
  { title: 'Quantity',  value: 'quantity',      sortable: true,   class: 'text-subtitle-1', align: 'center',},
  { title: 'Cost',      value: 'cogs',          sortable: true,   class: 'text-subtitle-1', align: 'start',},
  { title: 'Price',     value: 'selling_price', sortable: true,   class: 'text-subtitle-1', align: 'start',},
  { title: 'Actions',   value: 'actions',       sortable: false,  class: 'text-subtitle-1', align: 'center'},
];

export const headerOwner: HeaderOwner[] = [
    { title: 'Owner Name',    align: 'start',   key: 'name'           },
    { title: 'Active Flag',   align: 'start',   key: 'active_flag'    },
    { title: 'Inactive Date', align: 'start',   key: 'inactive_date'   },
    { title: 'Actions',       align: 'center',  key: 'actions', sortable: false },
]