// store/modules/masteritem/index.ts
import type { Module } from 'vuex';
import type { MasterItemState } from '@/types/MasterItem';
import type { RootState } from '@/store/types'; // define this if you haven't

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = (): MasterItemState => ({
  mItems: [],
  categories: [],
  loading: false,
  hasSaved: false,
  headers: [],
  headerscategory: [],
});

const masteritem: Module<MasterItemState, RootState> = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

export default masteritem;
