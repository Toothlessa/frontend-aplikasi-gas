import { RootState } from "@/store/types";
import { Module } from "vuex";

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import { UserState } from "@/types/User";

const state = (): UserState => ({
    currentUser: null,
    loading: false,
    loadingOne: false,
    loadingButtonCreate: false,
    loadingButtonUpdate: false,
    hasSaved: false,
});

const user: Module<UserState, RootState> = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
};

export default user;