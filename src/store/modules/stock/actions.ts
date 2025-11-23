import { CREATE_STOCK, LOAD_DETAIL_STOCK, LOAD_DISPLAY_STOCK, LOAD_STOCK, SET_DATA_DISPLAY_STOCK, SET_DATA_STOCK, SET_DETAIL_DATA_STOCK, SET_HASSAVED, SET_LOADING, SET_LOADING_DETAIL_STOCK, UPDATE_STOCK } from "@/store/storeconstant";
import { ActionTree } from "vuex";
import { RootState } from "@/store/types";
import { StockService } from "@/services/StockService";
import { CreateStockPayload, Stock, StockState } from "@/types";

const actions: ActionTree<StockState, RootState> = {

    async [CREATE_STOCK]({ commit, dispatch }, payload: CreateStockPayload) {

        try {
            await StockService.create(payload.itemId, payload.stock)
            dispatch(LOAD_STOCK);
            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED, false)
            }, 2000);
        } catch(error) {
            console.error('Failed to input stock');
            throw error;
        }
    },

    async [UPDATE_STOCK]({ commit, dispatch }, payload: {id:number, stock: Stock}) {
        try {
            await StockService.update(payload.id, payload.stock);
            dispatch(LOAD_STOCK);
            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED, false);
            }, 2000);
        } catch(error) {
            console.error('Failed to update stock');
            throw error;
        }
    },

    async [LOAD_STOCK]({ commit }): Promise<void> {
        commit(SET_LOADING, true);

        try{
            const data = await StockService.fetchData();
            commit(SET_DATA_STOCK, data);
        } catch(error) {
            console.error('Failed to load current stock data');
            throw error;
        } finally {
            commit(SET_LOADING, false);
        }
    },

    async [LOAD_DETAIL_STOCK]({ commit }, itemId): Promise<void> {
        commit(SET_LOADING_DETAIL_STOCK, true);
        try {
            const data = await StockService.fetchDetailData(itemId);
            commit(SET_DETAIL_DATA_STOCK, data);
        }catch(error) {
            console.error('Failed to load detail stock data');
            throw error;
        } finally {
            commit(SET_LOADING_DETAIL_STOCK, false);
        }
    },

    async [LOAD_DISPLAY_STOCK]({ commit }, payload: {filledId: number, emptyId: number}){
        commit(SET_LOADING, true);
        try{
            const data = await StockService.fetchDataDisplayStock(payload.filledId, payload.emptyId);
            commit(SET_DATA_DISPLAY_STOCK, data);
        }catch(error){
            console.error('Failed to load data display stock');
            throw error;
        }finally{
            commit(SET_LOADING, false);
        }
    },
    
};

export default actions;