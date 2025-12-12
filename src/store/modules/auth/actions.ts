import { AuthService } from "@/services/AuthService";
import { AUTH_ACTION, AUTO_LOGIN_ACTION, AUTO_LOGOUT_ACTION, LOGIN_ACTION, LOGOUT_ACTION, SET_AUTO_LOGOUT_MUTATION, SET_LOADING, SET_LOADING_BUTTON_CREATE, SET_USER_TOKEN_DATA_MUTATION, SIGNUP_ACTION } from "@/store/storeconstant";
import { RootState } from "@/store/types";
import { AuthState } from "@/types/Auth";
import { ActionTree } from "vuex";

const actions: ActionTree<AuthState, RootState> = {

    async [SIGNUP_ACTION](context, payload){
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            service: AuthService.register(payload)
        });
    },

    async [LOGIN_ACTION](context, payload,) {
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            service: AuthService.login(payload)
        });
    },

    [AUTO_LOGIN_ACTION](context) {
        const userData = localStorage.getItem("userData");
        if (!userData) return;

        const parsed = JSON.parse(userData);

        const expirationDate = Number(localStorage.getItem("expirationDate"));
        const now = new Date().getTime();

        const remainingTime = expirationDate - now;

        //console.log("remainingTime:", remainingTime);
        //console.log("userData:", parsed);

        if (remainingTime < 1000) {
            context.dispatch(AUTO_LOGOUT_ACTION);
            return;
        }

        context.commit(SET_USER_TOKEN_DATA_MUTATION, {
            ...parsed,
            expirationDate
        });
    },

  async [LOGOUT_ACTION]({ commit, dispatch }) {
    commit(SET_LOADING, true);
    try {
        const userData = localStorage.getItem('userData');

        if (userData !== null) {
            await AuthService.logout();
        }

        localStorage.removeItem('userData');
        commit(SET_USER_TOKEN_DATA_MUTATION, null);

    } catch (error) {
        console.error('Failed to logout');
        throw error;
    } finally {
        commit(SET_LOADING, false);
    }
  },

   async [AUTO_LOGOUT_ACTION](context) {
          localStorage.removeItem('userData');
          context.commit(SET_AUTO_LOGOUT_MUTATION);
    },

    async [AUTH_ACTION]({ commit }, { service }) {
        commit(SET_LOADING, true);

        try {
            const response = await service;

            // Hitung expiry timestamp
            //const expiresInMs = response.expiresIn * 1000; // 2 jam
            //const expiresInMs = response.expiresIn; // 10 detik
            const expiresInMs = response.expiresIn * 24 * 60 * 60 * 1000; // 10 hari
            const expirationDate = new Date().getTime() + expiresInMs;

            // Simpan ke localStorage
            localStorage.setItem('userData', JSON.stringify(response));
            localStorage.setItem('expirationDate', expirationDate.toString());

            // Commit ke Vuex
            commit(SET_USER_TOKEN_DATA_MUTATION, {
            ...response,
            expirationDate
            });

        } catch (error) {
            console.error('Fail authentication');
            throw error;
        } finally {
            commit(SET_LOADING, false);
        }
    },

}

export default actions;
