import { SET_DATA_STOCK, SET_DETAIL_DATA_STOCK, SET_HASSAVED, SET_LOADING, SET_LOADING_DETAIL_STOCK } from "@/store/storeconstant";
import {  Stock, StockDetail, StockState } from "@/types";
import { MutationTree } from "vuex";

const mutations: MutationTree<StockState> = {
    [SET_DATA_STOCK](state, payload: Stock[]) {
        state.stocks = payload;
    },

    [SET_DETAIL_DATA_STOCK](state, payload: StockDetail[]) {
        state.stockDetails = payload;
    },

    [SET_LOADING](state, loading: boolean) {
        state.loading = loading;
    },

    [SET_LOADING_DETAIL_STOCK](state, loadingDetail: boolean) {
        state.loading = loadingDetail;
    },


    [SET_HASSAVED](state, hasSaved: boolean) {
        state.hasSaved = hasSaved;
    },
};

export default mutations;