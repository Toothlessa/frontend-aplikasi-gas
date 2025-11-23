import type { Module } from 'vuex';
import type { RootState } from '@/store/types';
import { StockState } from "@/types";

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = (): StockState => ({
    stocks: [],
    stockDetails: [],
    stockTableColumn: [],
    stockDetailTableColumn: [],
    stockDisplay: null,
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
