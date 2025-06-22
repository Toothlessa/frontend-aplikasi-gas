import {
  SET_DATA_MITEM,
  SET_DATA_CATEGORY,
  SET_LOADING,
  SET_HASSAVED
} from '@/store/storeconstant';

import type { MutationTree } from 'vuex';
import type { MasterItemState, MasterItem, CategoryItem } from '@/types/masteritem';

const mutations: MutationTree<MasterItemState> = {
  [SET_DATA_MITEM](state, payload: MasterItem[]) {
    state.mItems = payload;
  },
  [SET_DATA_CATEGORY](state, payload: CategoryItem[]) {
    state.categories = payload;
  },
  [SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [SET_HASSAVED](state, value: boolean) {
    state.hasSaved = value;
  },
};

export default mutations;
