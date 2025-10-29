import type { Module } from 'vuex';
import type { RootState } from '@/store/types'; // define this if you haven't

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import { StockState } from "@/types";

const state = (): StockState => ({
    stocks: [],
    stockDetails: [],
    stockTableColumn: [],
    stockDetailTableColumn: [],
    createStockPayload: [],
    loading: false,
    loadingDetail: false,
    hasSaved: false,
});

const stock: Module<StockState, RootState> = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};

export default stock;