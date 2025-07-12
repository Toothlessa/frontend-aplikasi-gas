import {
  SET_LOADING,
  SET_HASSAVED,
  SET_DATA_ASSET,
  SET_DATA_OWNER
} from '@/store/storeconstant';

import type { MutationTree } from 'vuex';
import { Asset, AssetState, Owner } from '@/types';

const mutations: MutationTree<AssetState> = {
  [SET_DATA_ASSET](state, payload: Asset[]) {
    state.assets = payload;
  },
  [SET_DATA_OWNER](state, payload: Owner[]) {
    state.owners = payload;
  },
  [SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [SET_HASSAVED](state, value: boolean) {
    state.hasSaved = value;
  },
  SET_SELECTED_ASSET(state, payload: Asset[] | null) {
    console.log("Mutation Payload:", payload);
    state.selectedAsset = payload;
  },
};

export default mutations;
