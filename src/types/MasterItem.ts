export interface MasterItemState {
  mItems: MasterItem[];
  categories : CategoryItem[];
  loading: boolean;
  hasSaved: boolean;
  headers: Header[];
  headerscategory: HeaderCategory[];
}

export interface MasterItem {
  id: number | string;
  item_name: string;
  item_code: string;
  item_type: string | null | undefined;
  category_id: string | null | undefined;
  category: string;
  cost_of_goods_sold: number | string;
  selling_price: number | string;
  in_stock: boolean;
  active_flag: boolean;
}

export interface RawMasterItem {
  id: number | string;
  item_name: string;
  item_code: string;
  item_type: string | null | undefined;
  category_id: string | null | undefined;
  category: string;
  cost_of_goods_sold: number | string;
  selling_price: number | string;
  in_stock: string;
  active_flag: string;
}

export interface CategoryItem {
  id: number | string;
  name: string;
  active_flag: boolean | string;
  inactive_date: string;
}

export interface RawCategoryItem {
  id: number | string;
  name: string;
  active_flag: string;
  inactive_date: string;
}

export interface HeaderCategory {
  title: string;
  key: string;
  value?: string | ((item: any) => any);
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export interface Header {
  title: string;
  key: string;
  value?: string | ((item: any) => any);
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

type MasterItemKey = keyof MasterItem;

export interface Field {
  model: MasterItemKey;
  label: string;
  items?: any[];          // Optional
  itemTitle?: string;     // Optional
  itemValue?: string;     // Optional
  onEnterSubmit?: boolean;
}

function formatPrice(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `Rp${num.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&.')}`;
}

export const headers: Header[] = [
  { title: 'Item Name', align: 'start', key: 'item_name' },
  { title: 'Item Code', align: 'start', key: 'item_code' },
  { title: 'Item Type', align: 'start', key: 'item_type' },
  { title: 'Category', align: 'start', key: 'category' },
  {
    title: 'Cost of Goods',
    align: 'start',
    key: 'cost_of_goods_sold',
    value: (item: MasterItem) => formatPrice(item.cost_of_goods_sold),
  },
  {
    title: 'Selling Price',
    align: 'center',
    key: 'selling_price',
    value: (item: MasterItem) => formatPrice(item.selling_price),
  },
  { title: 'Stock', align: 'center', key: 'in_stock' },
  { title: 'Status', align: 'start', key: 'active_flag' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false },
];

export const headerscategory: HeaderCategory[] = [
  { title: 'Category Name', align: 'start', key: 'name' },
  { title: 'Status', align: 'start', key: 'active_flag' },
  { title: 'Last Active', align: 'start', key: 'inactive_date' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false },
];
