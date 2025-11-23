import { SET_DATA_DISPLAY_STOCK, SET_DATA_STOCK, SET_DETAIL_DATA_STOCK, SET_HASSAVED, SET_LOADING, SET_LOADING_DETAIL_STOCK } from "@/store/storeconstant";
import {  Stock, StockDetail, StockDisplay, StockState } from "@/types";
import { MutationTree } from "vuex";

const mutations: MutationTree<StockState> = {

    [SET_DATA_STOCK](state, payload: Stock[]) {
        state.stocks = payload;
    },
    [SET_DETAIL_DATA_STOCK](state, payload: StockDetail[]) {
        state.stockDetails = payload;
    },
    [SET_DATA_DISPLAY_STOCK](state, payload: StockDisplay){
        state.stockDisplay = payload;
    },
    // global mutations
    [SET_LOADING](state, loading: boolean) {
        state.loading = loading;
    },
    [SET_LOADING_DETAIL_STOCK](state, loadingDetail: boolean) {
        state.loadingDetail = loadingDetail;
    },
    [SET_HASSAVED](state, value: boolean) {
        state.hasSaved = value;
  },
};

export default mutations;