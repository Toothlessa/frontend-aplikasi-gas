import {
  SET_LOADING,
  SET_HASSAVED,
  SET_DATA_ASSET
} from '@/store/storeconstant';

import type { MutationTree } from 'vuex';
import { Asset, AssetState } from '@/types';

const mutations: MutationTree<AssetState> = {
  [SET_DATA_ASSET](state, payload: Asset[]) {
    state.assets = payload;
  },
  [SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [SET_HASSAVED](state, value: boolean) {
    state.hasSaved = value;
  },
};

export default mutations;
