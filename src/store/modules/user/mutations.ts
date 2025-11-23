import { SET_DATA_CURRENT_USER, SET_HASSAVED, SET_LOADING_BUTTON_UPDATE } from "@/store/storeconstant";
import {  } from "@/types";
import { User, UserState } from "@/types/User";
import { MutationTree } from "vuex";

const mutations: MutationTree<UserState> = {
    [SET_DATA_CURRENT_USER](state, payload: User){
        state.currentUser = payload;
    },
    // global mutations
    [SET_LOADING_BUTTON_UPDATE](state, loadingButtonUpdate: boolean){
        state.loadingButtonUpdate = loadingButtonUpdate;
    },
    [SET_HASSAVED](state, value: boolean) {
        state.hasSaved = value;
    },
};

export default mutations;