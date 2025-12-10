// import actions from "./actions";
// import getters from "./getters";
// import mutations from "./mutations";

// export default {
//     namespaced: true,
//     state() {
//         return {
//             userId: '',
//             email: '',
//             token: '',
//             expiresIn: 'sdsds',
//             autoLogout: false,
//         };
//     },
//     mutations,
//     getters,
//     actions,
// }


import { RootState } from "@/store/types";
import { Module } from "vuex";

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { AuthState } from "@/types/Auth";

const state = (): AuthState => ({
  authUser: null,    
  autoLogout: false,
  loading: false,
  loadingButtonCreate: false,
});


const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};

export default auth;