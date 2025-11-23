export interface StockState {
    stocks: Stock[];
    stockDetails: StockDetail[];
    stockTableColumn: StockTableColumn[];
    stockDetailTableColumn: StockDetailTableColumn[];
    stockDisplay: StockDisplay | null;

    createStockPayload: CreateStockPayload[];
    loading: boolean;
    loadingDetail: boolean;
    hasSaved: boolean;
}

export interface CreateStockPayload {
  itemId: number;
  stock: Stock;
}

export interface StockField {
    model: keyof Stock;
    label: string;
    items?: string[];
    itemTitle?: string;
    onEnterSubmit?: boolean;
}

export interface Stock {
    id: number;
    item_id: number;
    item_name: string;
    item_code: string;
    category: string;
    cogs: number;
    selling_price: number;
    total_stock: number;
}

export interface StockDetail {
    id: number;
    item_id: number;
    item_name: string;
    item_code: string;
    category: string;
    stock: number;
    created_at: Date;
}

export interface StockDisplay {
    running_stock: number;
    yesterday_stock: number;
    empty_gas: number;
    gas_owned: number;
}

export interface StockTableColumn {
    title: string;
    key: keyof Stock | 'actions';
    align?: 'start' | 'center' | 'end';
    sortable?: boolean;
}

export interface StockDetailTableColumn {
  title: string;
  key: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
}

export const stockTableColumn: StockTableColumn[] = [
    { key: 'item_name', align: 'start', title: 'Item Name'},
    { key: 'item_code', align: 'start', title: 'Item Code'},
    { key: 'category', align: 'start', title: 'Category'},
    { key: 'cogs', align: 'center', title: 'Cost of Goods'},
    { key: 'selling_price', align: 'center', title: 'Selling Price'},
    { key: 'total_stock', align: 'center', title: 'Running Stock'},
    { key: 'actions', align: 'center', title: 'Details', sortable: false},
];

export const stockDetailTableColumn: StockDetailTableColumn[] = [
    { key: 'id', align: 'center', title: 'No.'},
    { key: 'item_name', align: 'start', title: 'Item Name'},
    { key: 'item_code', align: 'start', title: 'Item Code'},
    { key: 'category', align: 'start', title: 'Category'},
    { key: 'stock', align: 'start', title: 'Stock Input'} ,
    { key: 'created_at', align: 'start', title: 'Date'},
    { key: 'actions', align: 'start', title: 'Actions', sortable: false}

];