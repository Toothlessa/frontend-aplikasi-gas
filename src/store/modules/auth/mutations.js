import {
    SET_AUTO_LOGOUT_MUTATION,
    SET_USER_TOKEN_DATA_MUTATION
} from "@/store/storeconstant";

export default {
    [SET_USER_TOKEN_DATA_MUTATION](state, payload) {
        state.userId = payload.id;
        state.username = payload.username;
        state.email = payload.email;
        state.token = payload.token;
        state.expiresIn = payload.expiresIn;
    },

    [SET_AUTO_LOGOUT_MUTATION](state) {
        state.autoLogout = true;
    },
}