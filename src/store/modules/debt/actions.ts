import { DebtService } from "@/services/DebtService";
import { CREATE_DEBT, LOAD_DATA_DEBT, LOAD_DATA_OUTSTANDING_DEBT, LOAD_DATA_SUMMARY_DEBT, SET_DATA_DEBT, SET_DATA_OUTSTANDING_DEBT, SET_DATA_SUMMARY_DEBT, SET_HASSAVED, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_LOADING_BUTTON_UPDATE, SET_LOADING_ONE, UPDATE_DEBT } from "@/store/storeconstant";
import { RootState } from "@/store/types";
import { Debt, DebtState } from "@/types";
import { ActionTree } from "vuex";

const actions: ActionTree<DebtState, RootState> = {

    async [CREATE_DEBT]({ commit, dispatch}, debt){
        commit(SET_LOADING_BUTTON_CREATE, true);
        try{
            await DebtService.createDebt(debt);

            dispatch(LOAD_DATA_SUMMARY_DEBT);
            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED, false)
            }, 2000);
        }catch(error){
            console.error('Failed to create data debt');
            throw error;
        }finally{
            commit(SET_LOADING_BUTTON_CREATE, false);
        }
    },

    async [UPDATE_DEBT]({ commit, dispatch}, payload){
        commit(SET_LOADING_BUTTON_UPDATE, true);
        try{
            await DebtService.updateDebt(payload.id, payload);

            dispatch(LOAD_DATA_SUMMARY_DEBT);
            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED, false);
            }, 2000);
        }catch(error){
            console.error('Failed to update debt');
            throw error;
        }finally{
            commit(SET_LOADING_BUTTON_UPDATE, false);
        }
    },

    async [LOAD_DATA_DEBT]({ commit }, customerId){
        commit(SET_LOADING, true);
        try{
            const data = await DebtService.fetchDetailDebtData(customerId);
            commit(SET_DATA_DEBT, data);
        }catch(error){
            console.error('Failed to load detail data debt');
            throw error;
        }finally{
            commit(SET_LOADING, false);
        }
    },

    async [LOAD_DATA_SUMMARY_DEBT]({ commit }){
        commit(SET_LOADING_ONE, true);
        try{
            const data = await DebtService.fetchSummaryDebtData();
            commit(SET_DATA_SUMMARY_DEBT, data);
        }catch(error){
            console.error('Failed to load summary debt');
            throw error;
        }finally{
            commit(SET_LOADING_ONE, false);
        }
    },

    async [LOAD_DATA_OUTSTANDING_DEBT]({ commit }){
        commit(SET_LOADING_ONE, true);
        try{
            const data = await DebtService.fetchOustandingDebt();
            commit(SET_DATA_OUTSTANDING_DEBT, data);
        }catch(error){
            console.error('Failed to load outstanding debt');
            throw error;
        }finally{
            commit(SET_LOADING_ONE, false);
        }
    }
};

export default actions;