import { SET_AUTO_LOGOUT_MUTATION, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_USER_TOKEN_DATA_MUTATION } from "@/store/storeconstant";
import { AuthState } from "@/types/Auth";
import { MutationTree } from "vuex";

const mutations: MutationTree<AuthState> = {
    [SET_USER_TOKEN_DATA_MUTATION] (state, payload) {
        state.authUser = payload;
    },
    [SET_AUTO_LOGOUT_MUTATION](state){
        state.autoLogout = true;
    },
    //globa mutations
    [SET_LOADING](state, loading){
        state.loading = loading;
    },
    [SET_LOADING_BUTTON_CREATE] (state, loadingButtonCreate){
        state.loadingButtonCreate = loadingButtonCreate;
    }
}

export default mutations;