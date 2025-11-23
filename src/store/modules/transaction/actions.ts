import { TransactionService } from "@/services/TransactionService";
import { CREATE_TRANSACTION, LOAD_TRANSACTION_BY_DATE, SET_DATA_TRANSACTION, SET_HASSAVED, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_LOADING_BUTTON_UPDATE } from "@/store/storeconstant";
import { RootState } from "@/store/types";
import { TransactionState } from "@/types/Transaction";
import { ActionTree } from "vuex";

const actions: ActionTree<TransactionState, RootState> = {
    
    async [CREATE_TRANSACTION] ({ commit}, transaction) {
        transaction.id 
            ? commit(SET_LOADING_BUTTON_UPDATE, true)
            : commit(SET_LOADING_BUTTON_CREATE, true);

        try {
            await TransactionService.createOrUpdateTransaction(transaction);
            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED, false)
            }, 2000);

        } catch(error) {
            console.error('Failed to create transaction data : ', error);
            throw error;
        }finally{
            transaction.id 
                ? commit(SET_LOADING_BUTTON_UPDATE, false)
                : commit(SET_LOADING_BUTTON_CREATE, false);
        }
    },

    async[LOAD_TRANSACTION_BY_DATE]({ commit }, date) {
        commit(SET_LOADING, true);
        try{
            const data = await TransactionService.fetchTransactionByDate(date);
            commit(SET_DATA_TRANSACTION, data);
            console.log('LOAD_TRANSACTION_BY_DATE in try');
        }catch(error){
            console.error('Failed to load data transaction : ', error);
            throw error;
        }finally{
            commit(SET_LOADING, false);
        }
    }
};

export default actions;