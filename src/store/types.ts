import { MasterItemState, CustomerState, AssetState, GlobalState, StockState } from '@/types';

export interface RootState {
  global: GlobalState;
  asset: AssetState;
  customer: CustomerState;
  masteritem: MasterItemState;
  stock: StockState;
}
