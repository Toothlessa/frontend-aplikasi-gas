// store/modules/masteritem/index.ts
import type { Module } from 'vuex';
import type { RootState } from '@/store/types'; // define this if you haven't

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import { AssetState } from '@/types';

const state = (): AssetState => ({
  assets: [],
  owners: [],
  loading: false,
  hasSaved: false,
  headerAsset: [],
  headerOwner: [],
  selectedAsset: null,
});

const asset: Module<AssetState, RootState> = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

export default asset;
