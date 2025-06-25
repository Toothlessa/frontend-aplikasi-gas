import {
  SET_DATA_CUSTOMER,
  SET_LOADING,
  SET_HASSAVED
} from '@/store/storeconstant';

import type { MutationTree } from 'vuex';
import type { CustomerState, Customer } from '@/types/Customer';

const mutations: MutationTree<CustomerState> = {
  [SET_DATA_CUSTOMER](state, payload: Customer[]) {
    state.customers = payload;
  },
  [SET_LOADING](state, loading: boolean) {
    state.loading = loading;
  },
  [SET_HASSAVED](state, value: boolean) {
    state.hasSaved = value;
  },
};

export default mutations;