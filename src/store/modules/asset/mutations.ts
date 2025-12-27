import {
  SET_LOADING,
  SET_HASSAVED,
  SET_DATA_ASSET,
  SET_DATA_OWNER,
  SET_DATA_ASSET_DETAIL,
  SET_LOADING_BUTTON_CREATE,
  SET_LOADING_ONE
} from '@/store/storeconstant';

import type { MutationTree } from 'vuex';
import { Asset, AssetState, Owner } from '@/types';

const mutations: MutationTree<AssetState> = {
  [SET_DATA_ASSET](state, payload: Asset[]) {
    state.assets = payload;
  },
  [SET_DATA_ASSET_DETAIL](state, payload: Asset[]) {
    state.assetDetails = payload;
  },
  [SET_DATA_OWNER](state, payload: Owner[]) {
    state.owners = payload;
  },
  [SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [SET_LOADING_ONE](state, loadingOwner: boolean) {
    state.loadingOwner = loadingOwner;
  },
  [SET_LOADING_BUTTON_CREATE](state, loading: boolean) {
    state.loadingButtonCreate = loading;
  },
  [SET_HASSAVED](state, value: boolean) {
    state.hasSaved = value;
  },
};

export default mutations;
