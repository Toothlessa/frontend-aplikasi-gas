import Axios from "axios";
import Validations from "@/services/Validations";
import {
    SIGNUP_ACTION,
    LOGIN_ACTION,
    AUTO_LOGIN_ACTION,
    AUTH_ACTION,
    SET_USER_TOKEN_DATA_MUTATION,
    LOGOUT_ACTION,
    // AUTO_LOGOUT_ACTION,
    // SET_AUTO_LOGOUT_MUTATION,
    GET_USER_TOKEN_GETTER,
} from "@/store/storeconstant";
import store from "@/store/store";

let timer = '';
export default {

    async [SIGNUP_ACTION](context, payload) {
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            url: 'http://127.0.0.1:8000/api/users',
        });
    },

    async [LOGIN_ACTION](context, payload) {
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            url: 'http://127.0.0.1:8000/api/users/login',
        });
    },

    // [AUTO_LOGIN_ACTION](context) {
    //     let userDataString = localStorage.getItem('userData');

    //     if (userDataString) {
    //         let userData = JSON.parse(userDataString);
    //         let expirationTime = userData.expiresIn - new Date().getMilliseconds();

    //         if (expirationTime < 5000) {
    //             console.log("first condition Expires In= " + userData.expiresIn)
    //             console.log("first condition New Date= " + new Date().getMilliseconds())
    //             console.log("first condition Expiration Time= " + expirationTime)
    //             context.dispatch(AUTO_LOGOUT_ACTION);
    //             context.dispatch(LOGOUT_ACTION);
    //         } else {
    //             timer = setTimeout(() => {
    //                 context.dispatch(AUTO_LOGOUT_ACTION);
    //                 context.dispatch(LOGOUT_ACTION);
    //             }, expirationTime);
    //         }

    //         context.commit(SET_USER_TOKEN_DATA_MUTATION, userData);
    //     }
    // },

    [AUTO_LOGIN_ACTION](context) {
        let userData = localStorage.getItem('userData');
        if (userData) {
            context.commit(SET_USER_TOKEN_DATA_MUTATION, JSON.parse(userData));
        }
    },

    async [LOGOUT_ACTION](context) {
        await Axios.delete('http://127.0.0.1:8000/api/users/logout', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            }
        });

        context.commit(SET_USER_TOKEN_DATA_MUTATION, {
            userId: null,
            username: null,
            email: null,
            token: null,
            expiresIn: null,
        });
        localStorage.removeItem('userData');
        if (timer) {
            clearTimeout(timer);
        }
    },

    // [AUTO_LOGOUT_ACTION](context) {
    //     context.dispatch(LOGOUT_ACTION);
    //     context.commit(SET_AUTO_LOGOUT_MUTATION);
    // },

    async [AUTH_ACTION](context, payload) {
        let postData = {
            username: payload.username,
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
        };

        let response = '';

        try {
            response = await Axios.post(payload.url, postData);
        } catch (error) {
            let errorMessage = Validations.getErrorMessageFromCode(
                error.response.data.errors[0],
            );
            throw errorMessage;
        }

        if (response.status === 200 || response.status === 201) {
            let expirationTime = +response.data.data.expiresIn * 1000000000;

            timer = setTimeout(() => {
                // context.dispatch(AUTO_LOGOUT_ACTION);
                context.dispatch(LOGOUT_ACTION);
            }, expirationTime);

            let tokenData = {
                userId: response.data.data.id,
                username: response.data.data.username,
                email: response.data.data.email,
                token: response.data.data.token,
                expiresIn: expirationTime
            };

            localStorage.setItem('userData', JSON.stringify(tokenData));
            context.commit(SET_USER_TOKEN_DATA_MUTATION, tokenData);
        }
    },
}