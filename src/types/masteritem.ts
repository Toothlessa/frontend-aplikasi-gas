export interface MasterItemState {
  mItems: MasterItem[];
  loading: boolean;
   headers: Header[];
}

export interface MasterItem {

  item_name: string;
  item_code: string;
  item_type: string;
  category: string;
  cost_of_goods_sold: number | string;
  selling_price: number | string;
  in_stock: boolean;
  active_flag: boolean;
}

export interface Header {
  title: string;
  key: string;
  value?: string | ((item: any) => any);
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
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
    value: (_item: MasterItem) => formatPrice(_item.cost_of_goods_sold),
  },
  {
    title: 'Selling Price',
    align: 'center',
    key: 'selling_price',
    value: (_item: MasterItem) => formatPrice(_item.selling_price),
  },
  { title: 'Stock', align: 'center', key: 'in_stock' },
  { title: 'Status', align: 'center', key: 'active_flag' },
  { title: 'Actions', key: 'actions', sortable: false },
];


