import {
  SET_DATA_CUSTOMER,
  SET_LOADING,
  SET_HASSAVED,
  SET_DATA_TOP_CUSTOMER,
  SET_LOADING_BUTTON_CREATE
} from '@/store/storeconstant';

import type { MutationTree } from 'vuex';
import type { CustomerState, Customer, TopCustomerTransaction } from '@/types/Customer';

const mutations: MutationTree<CustomerState> = {
  [SET_DATA_CUSTOMER](state, payload: Customer[]) {
    state.customers = payload;
  },
  [SET_DATA_TOP_CUSTOMER](state, payload: TopCustomerTransaction[]) {
    state.topCustomerTransaction = payload;
  },
  [SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [SET_LOADING_BUTTON_CREATE](state, loading: boolean) {
    state.loadingButtonCreate = loading;
  },
  [SET_HASSAVED](state, value: boolean) {
    state.hasSaved = value;
  },
};

export default mutations;