import { TransactionService } from "@/services/TransactionService";
import { CREATE_TRANSACTION, LOAD_LAST_30_DAYS_TRANSACTION, LOAD_OUTSTANDING_TRANSACTION, LOAD_TRANSACTION_BY_DATE, SET_DATA_LAST_30_DAYS_TRANSACTION, SET_DATA_OUTSTANDING_TRANSACTION, SET_DATA_TRANSACTION, SET_HASSAVED, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_LOADING_BUTTON_UPDATE, SET_LOADING_ONE } from "@/store/storeconstant";
import { RootState } from "@/store/types";
import { TransactionState } from "@/types/Transaction";
import { ActionTree } from "vuex";

const actions: ActionTree<TransactionState, RootState> = {
    
    async [CREATE_TRANSACTION] ({ commit, dispatch}, transaction) {
        transaction.id 
            ? commit(SET_LOADING_BUTTON_UPDATE, true)
            : commit(SET_LOADING_BUTTON_CREATE, true);

        try {
            await TransactionService.createOrUpdateTransaction(transaction);
            dispatch(LOAD_OUTSTANDING_TRANSACTION);
            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED, false)
            }, 2000);

        } catch(error) {
            console.error('Failed to create transaction data : ', error);
            throw error;
        }finally{
        setTimeout(() => {
            transaction.id 
                ? commit(SET_LOADING_BUTTON_UPDATE, false)
                : commit(SET_LOADING_BUTTON_CREATE, false);
        }, 2000);
        }
        
    },

    async[LOAD_TRANSACTION_BY_DATE]({ commit }, date) {
        commit(SET_LOADING, true);
        try{
            const data = await TransactionService.fetchTransactionByDate(date);
            commit(SET_DATA_TRANSACTION, data);
        }catch(error){
            console.error('Failed to load data transaction : ', error);
            throw error;
        }finally{
            commit(SET_LOADING, false);
        }
    },

    async[LOAD_OUTSTANDING_TRANSACTION]({ commit }){
        commit(SET_LOADING, true);
        try{
            const data = await TransactionService.fetchOutstandingTransaction();
            commit(SET_DATA_OUTSTANDING_TRANSACTION, data);
        }catch(error){
            console.error('Failed to load data oustanding transaction');
            throw error;
        }finally{
            commit(SET_LOADING, false);
        }
    },

    async[LOAD_LAST_30_DAYS_TRANSACTION]({ commit }){
        commit(SET_LOADING_ONE, true);
        try{
            const data = await TransactionService.fetchLast30DaysSale();
            commit(SET_DATA_LAST_30_DAYS_TRANSACTION, data);
        }catch(error){
            console.error('Failed to load last 30 days transaction');
            throw error;
        }finally{
            commit(SET_LOADING_ONE, true);
        }
    }
};

export default actions;