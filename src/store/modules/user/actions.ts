import { UserService } from "@/services/UserService";
import { LOAD_CURRENT_USER, SET_DATA_CURRENT_USER, SET_HASSAVED, SET_LOADING_BUTTON_UPDATE, UPDATE_CURRENT_USER } from "@/store/storeconstant";
import { RootState } from "@/store/types";
import { UserState } from "@/types/User";
import { ActionTree } from "vuex";

const actions: ActionTree<UserState, RootState> = {

    async [UPDATE_CURRENT_USER]({ commit, dispatch }, payload){
        commit(SET_LOADING_BUTTON_UPDATE, true);
        try{
            await UserService.updateUser(payload);

            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED)
            }, 2000);
        }catch(error){
            console.error('Failed to update current user');
            throw error;
        }finally{
            commit(SET_LOADING_BUTTON_UPDATE, false);
        }
    },

    async [LOAD_CURRENT_USER]({ commit }){
        try{
            const data = await UserService.fetchDataUser();
            commit(SET_DATA_CURRENT_USER, data);
        }catch(error){
            console.error('Failed to load current user');
            throw error;
        }
    },
}

export default actions;