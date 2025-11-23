import { SET_DATA_DEBT, SET_DATA_SUMMARY_DEBT, SET_HASSAVED, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_LOADING_BUTTON_UPDATE, SET_LOADING_ONE } from "@/store/storeconstant";
import { Debt, DebtState, SummaryDebt, TopCustomerTransaction } from "@/types";
import { MutationTree } from "vuex";

const mutations: MutationTree<DebtState> = {
    [SET_DATA_DEBT](state, payload: Debt []) {
        state.debts = payload;
    },
    [SET_DATA_SUMMARY_DEBT](state, payload: SummaryDebt[]){
        state.summaryDebts = payload;
    },
    // global mutations
    [SET_LOADING](state, loading: boolean) {
        state.loading = loading;
    },
    [SET_LOADING_ONE](state, loadingOne: boolean){
        state.loadingOne = loadingOne;
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