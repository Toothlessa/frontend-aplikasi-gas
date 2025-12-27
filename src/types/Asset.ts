export interface AssetState {
  assets: Asset[];
  owners: Owner[];
  assetDetails: Asset[];
  headerAsset: HeaderAsset[];
  headerAssetDetail: HeaderAsset[];
  headerOwner: HeaderOwner[];
  loading: boolean;
  loadingOwner: boolean;
  loadingButtonCreate: boolean;
  hasSaved: boolean;
  selectedAsset: Asset[] | null;
}

type AssetKey = keyof Asset;

export interface AssetField {
  model: AssetKey;
  label: string;
  items?: { id: number, name: string }[];
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
  created_at: Date | string;
  created_by: number | string;
}

export interface Owner {
  id: number;
  name: string;
  active_flag: boolean;
  inactive_date: string;
}

export interface HeaderAsset {
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  class?: string;
  sortable?: boolean;
}

export interface HeaderOwner {
  title: string;
  key: string;
  value?: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export const headerOwner: HeaderOwner[] = [
  { title: 'Owner Name', align: 'start', key: 'name' },
  { title: 'Active Flag', align: 'start', key: 'active_flag' },
  { title: 'Inactive Date', align: 'start', key: 'inactive_date' },
  { title: 'Actions', align: 'center', key: 'actions', sortable: false },
];

export const headerAsset: HeaderAsset[] = [
  { title: 'Name', key: 'item_name', sortable: true, class: 'text-subtitle-1', align: 'start', },
  { title: 'Owner', key: 'owner_name', sortable: true, class: 'text-subtitle-1', align: 'start', },
  { title: 'Quantity', key: 'quantity', sortable: true, class: 'text-subtitle-1', align: 'center', },
  { title: 'Cost', key: 'cogs', sortable: true, class: 'text-subtitle-1', align: 'start', },
  { title: 'Price', key: 'selling_price', sortable: true, class: 'text-subtitle-1', align: 'start', },
  { title: 'Actions', key: "actions", sortable: false, class: 'text-subtitle-1', align: 'center' },
];

export const headerAssetDetail: HeaderAsset[] = [
  { title: 'Name', key: 'item_name', sortable: true, class: 'text-subtitle-1', align: 'start', },
  { title: 'Owner', key: 'owner_name', sortable: true, class: 'text-subtitle-1', align: 'start', },
  { title: 'Description', key: 'description', sortable: true, class: 'text-subtitle-1', align: 'start', },
  { title: 'Quantity', key: 'quantity', sortable: true, class: 'text-subtitle-1', align: 'center', },
  { title: 'Cost', key: 'cogs', sortable: true, class: 'text-subtitle-1', align: 'center', },
  { title: 'Price', key: 'selling_price', sortable: true, class: 'text-subtitle-1', align: 'center', },
  { title: 'Date', key: 'created_at', sortable: true, class: 'text-subtitle-1', align: 'center', },
  { title: 'Actions', key: 'actions', sortable: false, class: 'text-subtitle-1', align: 'center' },
]