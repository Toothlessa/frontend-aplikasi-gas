import { CustomerState } from "@/types";
import { RootState } from "@/store/types";
import { Module } from "vuex";

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";


const state = (): CustomerState => ({
  customers: [],
  topCustomerTransaction: [],
  loading: false,
  hasSaved: false,
  headerCustomer: [],
});

const customer: Module<CustomerState, RootState> = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

export default customer;