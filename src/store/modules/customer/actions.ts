import {
  CREATE_CUSTOMER,
  DEACTIVATE_CUSTOMER,
  LOAD_CUSTOMER_DATA,
  SET_DATA_CUSTOMER,
  SET_HASSAVED,
  SET_LOADING,
  UPLOAD_CUSTOMER
} from '@/store/storeconstant';
import {  ActionTree } from 'vuex';
import { CustomerState } from '@/types/Customer';
import { RootState } from '@/store/types'; // ← create this file too
import { CustomerService } from '@/services/CustomerService';

const actions: ActionTree<CustomerState, RootState> = {

  async [CREATE_CUSTOMER] ( { commit, dispatch}, customer) {
    try {
      
      await CustomerService.createOrUpdateCustomer(customer);
      
      dispatch(LOAD_CUSTOMER_DATA);
      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, false)
      }, 2000);

    } catch(error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  },

  async [LOAD_CUSTOMER_DATA]({ commit }) {

    commit(SET_LOADING, true);
    try {
      
      const data = await CustomerService.fetchCustomers();
      commit(SET_DATA_CUSTOMER, data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      throw error;
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async[DEACTIVATE_CUSTOMER]({ commit, dispatch }, id: number) {
    
    commit(SET_LOADING, true);
    try {
      
      await CustomerService.deactiveCustomer(id);

      dispatch(LOAD_CUSTOMER_DATA);
      commit(SET_HASSAVED,true);
      setTimeout(()=> {
        commit(SET_HASSAVED, false);
      }, 2000);
    } catch(error) {
      console.error('Failed to deactive the customer:', error);
      throw error;
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async[UPLOAD_CUSTOMER]({ commit, dispatch }, file: File) {
    try {

      await CustomerService.uploadCustomer(file);

      dispatch(LOAD_CUSTOMER_DATA);
      commit(SET_HASSAVED, true);
      setTimeout(() => {
        commit(SET_HASSAVED, true);
      }, 2000);
    } catch(error) {
      console.error('Failed to upload customers: ', error);
      throw error;
    } finally {
      commit(SET_HASSAVED, false);
    }
  },

};

export default actions;

