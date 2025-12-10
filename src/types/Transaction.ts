// ⚡️ JANGAN import useTransaction di sini
// Header harus statis, tidak boleh memakai composable

export interface TransactionState {
  transactions: Transaction[];
  outstandingTransaction: Transaction[];
  dailySaleTransaction: DailySale[];
  headerTransaction: HeaderTransaction[];
  headerOutstanding: HeaderTransaction[];
  loading: boolean;
  loadingData: boolean;
  loadingButtonCreate: boolean;
  loadingButtonUpdate: boolean
  hasSaved: boolean;
}

export interface Transaction {
  id: number | null;
  quantity: number | null;
  stock: number;
  amount: number;
  total: number;
  description: string;
  item_id: number;
  stockId: number;
  customer_id: number | null;
  createdBy: string;
  createdDate: Date;
}

export interface DailySale {
  month: string;
  day: string;
  total: number;
}

export interface HeaderTransaction {
  title: string;
  key: string;
  align?: "start" | "center" | "end";
  class?: string;
  sortable?: boolean;
}

// ⚡ header harus SEDERHANA. Tidak boleh ada formatter.
export const headerTransaction: HeaderTransaction[] = [
  { title: "Customer", align: "start", key: "customer_name", class: "text-subtitle-1" },
  { title: "Description", align: "center", key: "description", class: "text-subtitle-1" },
  { title: "Qty", align: "center", key: "quantity", class: "text-subtitle-1" },
  { title: "Price", align: "start", key: "amount", class: "text-subtitle-1" },
  { title: "Total", align: "start", key: "total", class: "text-subtitle-1" },
  { title: "Created", align: "start", key: "created_at", class: "text-subtitle-1" },
  { title: "Actions", align: "center", key: "actions", class: "text-subtitle-1", sortable: false },
];


// Dashboard header → hanya ambil kolom tertentu
export const headerOutstanding = headerTransaction.filter((h) =>
  [
    "customer_name",  "description", "quantity", "total", "created_at", "actions"
  ].includes(h.key)
);