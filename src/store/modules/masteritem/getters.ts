// store/modules/masteritem/getters.ts
import type { GetterTree } from 'vuex';
import type { MasterItemState, MasterItem } from '@/types/MasterItem';
import type { RootState } from '@/store/types';

const getters: GetterTree<MasterItemState, RootState> = {
  // Getter lain milik Anda tetap di sini...

  getMItemsGasIsi: (state: MasterItemState): MasterItem[] => {
    return state.mItemsGasIsi || [];
  },
};

export default getters;
