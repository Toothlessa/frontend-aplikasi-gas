import { SET_DATA_TRANSACTION, SET_HASSAVED, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_LOADING_BUTTON_UPDATE,  } from "@/store/storeconstant";
import { Transaction, TransactionState } from "@/types/Transaction";
import { MutationTree } from "vuex";

const mutations: MutationTree<TransactionState> = {
    [SET_DATA_TRANSACTION](state, payload: Transaction []) {
        state.transactions = payload;
    },
    // global mutations
    [SET_LOADING](state, loading: boolean) {
        state.loading = loading;
    },
    [SET_LOADING_BUTTON_CREATE](state, loadingButtonCreate: boolean){
        state.loadingButtonCreate = loadingButtonCreate;
    },
    [SET_LOADING_BUTTON_UPDATE](state, loadingButtonUpdate: boolean){
        state.loadingButtonUpdate = loadingButtonUpdate;
    },
    [SET_HASSAVED](state, value: boolean) {
        state.hasSaved = value;
    },
};

export default mutations;