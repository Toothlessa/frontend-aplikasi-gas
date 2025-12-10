import { MasterItemState, CustomerState, AssetState, GlobalState, StockState, DebtState, UserState } from '@/types';
import { AuthState } from '@/types/Auth';
import { TransactionState } from '@/types/Transaction';

export interface RootState {
  global: GlobalState;
  asset: AssetState;
  customer: CustomerState;
  masteritem: MasterItemState;
  stock: StockState;
  transaction: TransactionState;
  debt: DebtState;
  user: UserState;
  auth: AuthState;
}
