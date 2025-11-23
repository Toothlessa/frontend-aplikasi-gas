import { RootState } from "@/store/types";
import { Module } from "vuex";

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import { DebtState } from "@/types";

const state = (): DebtState => ({
    debts: [],
    summaryDebts: [],
    headerDetailDebt: [],
    headerSummaryDebt: [],
    loading: false,
    loadingOne: false,
    loadingButtonCreate: false,
    loadingButtonUpdate: false,
    hasSaved: false,
});

const debt: Module<DebtState, RootState> = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};

export default debt;