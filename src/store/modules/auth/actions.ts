import { AuthService } from "@/services/AuthService";
import { AUTO_LOGIN_ACTION, LOGIN_ACTION, LOGOUT_ACTION, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_USER_TOKEN_DATA_MUTATION, SIGNUP_ACTION } from "@/store/storeconstant";
import { RootState } from "@/store/types";
import { AuthState } from "@/types/Auth";
import { ActionTree } from "vuex";

const actions: ActionTree<AuthState, RootState> = {

    async  [SIGNUP_ACTION]({ commit, dispatch}, authUser)  {
        commit(SET_LOADING_BUTTON_CREATE, true);
        try{
            const data = await AuthService.register(authUser);
            commit(SET_USER_TOKEN_DATA_MUTATION, data)
        }catch(error){
            console.error('Failed register user');
            throw error;
        }finally{
            commit(SET_LOADING_BUTTON_CREATE, false);
        }
    },

    [AUTO_LOGIN_ACTION](context) {
        const userData = localStorage.getItem('userData');
        if (userData) {
            context.commit(SET_USER_TOKEN_DATA_MUTATION, JSON.parse(userData));
        }
    },

    async  [LOGIN_ACTION]({ commit, dispatch}, authUser)  {
        commit(SET_LOADING, true);
        try{
            const data = await AuthService.login(authUser);
            localStorage.setItem('userData', JSON.stringify(data));
            commit(SET_USER_TOKEN_DATA_MUTATION, data)
        }catch(error){
            console.error('Failed to login');
            throw error;
        }finally{
            commit(SET_LOADING, false);
        }
    },

    async [LOGOUT_ACTION]({ commit, dispatch }) {
        commit(SET_LOADING, true);
        try{
            await AuthService.logout();
        }catch(error){
            console.error('Failed to logout');
            throw error;
        }finally{
            commit(SET_LOADING, false);
        }
    },
}

export default actions;