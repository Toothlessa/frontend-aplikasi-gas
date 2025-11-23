import {
  CREATE_ASSET,
  CREATE_OWNER,
  DEACTIVE_OWNER,
  LOAD_ASSET,
  LOAD_OWNER,
  SET_DATA_ASSET,
  SET_DATA_OWNER,
  SET_HASSAVED,
  LOAD_ASSET_DETAILS_BY_SUMMARY,
  SET_LOADING,
  SET_DATA_ASSET_DETAIL,
} from '@/store/storeconstant';
import { ActionTree } from 'vuex';
import { RootState } from '@/store/types'; // ← create this file too
import { AssetState} from '@/types';
import { AssetService } from '@/services/AssetService';
import { AssetOwnerService } from '@/services/AssetOwnerService';

const actions: ActionTree<AssetState, RootState> = {

  async [CREATE_ASSET]({ commit, dispatch }, asset){
    try {
      await AssetService.createOrUpdateAsset(asset);
      dispatch(LOAD_ASSET);

      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, false)
      }, 2000);
    } catch(error) {
      console.error('Failed to create asset');
      throw error;
    }
  },

  async [LOAD_ASSET]({ commit }) {
    commit(SET_LOADING, true);
    try {
      const data = await AssetService.fetchAssetSummary();
      commit(SET_DATA_ASSET, data);
    } catch(error) {
      console.error('Failed to load asset data');
      throw error;
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [LOAD_OWNER]({ commit }) {
    commit(SET_LOADING, true);
    try {
      const data = await AssetOwnerService.fetchData();
      commit(SET_DATA_OWNER, data);
    } catch (error) {
      console.error('Failed to load data owner');
      throw error;
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [CREATE_OWNER]({ commit, dispatch }, owner) {

    try {
      await AssetOwnerService.createOrUpdate(owner.id, owner);
      dispatch(LOAD_ASSET);
      dispatch(LOAD_OWNER);
      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, false);
      }, 2000);
    } catch(error) {
      console.error('Failed to create owner');
      throw error;
    }
  },

  async [DEACTIVE_OWNER]({commit, dispatch}, id) {
    try{
      await AssetOwnerService.deactive(id);
      dispatch(LOAD_OWNER);
      dispatch(LOAD_ASSET);
      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, false)
      }, 2000);
    } catch(error) {
      console.error('Failed to deactive owner');
      throw error;
    }
  },

  async[LOAD_ASSET_DETAILS_BY_SUMMARY]({commit}, {ownerId, itemId}) {
    commit(SET_LOADING, true);
    try {
      const data = await AssetService.fetchAssetDetailSummary(ownerId, itemId);
      commit(SET_DATA_ASSET_DETAIL, data);
    }catch(error) {
      console.error('Failed to load data detail asset');
      throw error;
    } finally {
      commit(SET_LOADING, false);
    }
  },

};

export default actions;