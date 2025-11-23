import {
  LOAD_MASTER_ITEM,
  LOAD_CATEGORY_ITEM,
  CREATE_ITEM,
  CREATE_CATEGORY_ITEM,
  SET_DATA_MITEM,
  SET_LOADING,
  SET_HASSAVED,
  SET_DATA_CATEGORY,
  DEACTIVATE_ITEM,
  DEACTIVATE_ITEM_CATEGORY,
  LOAD_MASTER_ITEM_BY_TYPE,
  SET_DATA_MITEM_BY_TYPE,
} from '@/store/storeconstant';
import { ActionTree } from 'vuex';
import { MasterItemState } from '@/types/MasterItem';
import { RootState } from '@/store/types'; // ← create this file too
import { MasterItemService } from '@/services/MasterItemService';
import { CategoryItemService } from '@/services/CategoryItemService';

const actions: ActionTree<MasterItemState, RootState> = {

  async [CREATE_ITEM]( { commit, dispatch }, masteritem) {
    try {

      await MasterItemService.createOrUpdate(masteritem);
      await dispatch(LOAD_MASTER_ITEM);

      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, false)
      }, 2000);
    } catch(error) {
      console.error('Failed to create master item : ', error);
      throw error;
    } finally {
      commit(SET_HASSAVED, false);
    }
  },

  async [LOAD_MASTER_ITEM]({ commit }) {

    commit(SET_LOADING, true);
    try {

      const data = await MasterItemService.fetchData();
      commit(SET_DATA_MITEM, data);
    }catch(error) {
      console.error('Failed to load master item data');
      throw error;
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [LOAD_MASTER_ITEM_BY_TYPE]({ commit}, itemType: string) {
    try {
      const data = await MasterItemService.fetchItemByType(itemType);
      commit(SET_DATA_MITEM_BY_TYPE, data);
    }catch(error){
      console.error('failed to load data masteritem by item type');
      throw error;
    }
  },

  async [DEACTIVATE_ITEM]({ commit, dispatch }, id: number) {
    
    commit(SET_LOADING, true);
    try {
      await MasterItemService.deactive(id);
      dispatch(LOAD_MASTER_ITEM);
      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, false);
      }, 2000);

    } catch (error) {
      console.error('Failed to deactive the item', error);
      throw error;
    } finally {
      commit(SET_HASSAVED, false);
    }
  },

  async [CREATE_CATEGORY_ITEM]({ commit, dispatch}, categoryItem) {
    try {
      const respone = await CategoryItemService.createOrUpdate(categoryItem);
      console.log('Cek : ', respone)
      dispatch(LOAD_CATEGORY_ITEM);
      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, true)
      }, 2000);

    } catch(error) {
      console.error('Failed to create the customer', error);
      throw error;
    } finally {
      commit(SET_HASSAVED, false);
    }
  },

  async [LOAD_CATEGORY_ITEM]({ commit }) {

    commit(SET_LOADING, true);
    try {

      const data = await CategoryItemService.fetchData();
      commit(SET_DATA_CATEGORY, data);
    }catch(error) {
      console.error('Failed to load category item data');
      throw error;
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [DEACTIVATE_ITEM_CATEGORY]({ commit, dispatch }, id: number) {
    try {

      await CategoryItemService.deactive(id);
      dispatch(LOAD_CATEGORY_ITEM);
      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, true);
      });
    } catch(error) {
      console.error('Failed to deactive the master item', error);
      throw error;
    } finally {
      commit(SET_HASSAVED, false);
    }
  }

};

export default actions;
