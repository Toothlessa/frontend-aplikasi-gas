import { RootState } from "@/store/types";
import { TransactionState } from "@/types/Transaction";
import { Module } from "vuex";

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = (): TransactionState => ({
    transactions: [],
    outstandingTransaction: [],
    dailySaleTransaction: [],
    headerTransaction: [],
    headerOutstanding: [],
    loading: false,
    loadingData: false,
    loadingButtonCreate: false,
    loadingButtonUpdate: false,
    hasSaved: false,
});

const transaction: Module<TransactionState, RootState> = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};

export default transaction;