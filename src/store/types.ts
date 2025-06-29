import { MasterItemState, CustomerState, AssetState } from '@/types';

export interface RootState {
  masteritem: MasterItemState;
  customer: CustomerState;
  asset: AssetState;
}
