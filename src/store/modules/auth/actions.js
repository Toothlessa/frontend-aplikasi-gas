import Axios from "axios";
import Validations from "@/services/Validations";
import {
    SIGNUP_ACTION,
    LOGIN_ACTION,
    AUTH_ACTION,
    // AUTO_LOGOUT_ACTION, 
    SET_USER_TOKEN_DATA_MUTATION,
    AUTO_LOGIN_ACTION,
    LOGOUT_ACTION,
    GET_USER_TOKEN_GETTER
} from "@/store/storeconstant";
import store from "@/store/store";

// let timer= '';
export default {

    async [SIGNUP_ACTION](context, payload) {
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            url: 'http://127.0.0.1:8000/api/users',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            }
        });
    },

    async [LOGIN_ACTION](context, payload) {
        return context.dispatch(AUTH_ACTION, {
            ...payload,
            url: 'http://127.0.0.1:8000/api/users/login',
        });
    },

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
    },

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
            // let expirationTime = +response.data.expiresIn * 1000;

            // timer = setTimeout(() => {
            //     context.dispatch(AUTO_LOGOUT_ACTION);
            // }, expirationTime);

            let tokenData = {
                userId: response.data.data.id,
                username: response.data.data.username,
                email: response.data.data.email,
                token: response.data.data.token,
                expiresIn: response.data.data.expiresIn
            };
            // console.log('Halo Nama Saya Renan');

            localStorage.setItem('userData', JSON.stringify(tokenData));
            context.commit(SET_USER_TOKEN_DATA_MUTATION, tokenData);
            console.log(JSON.stringify(tokenData));
        }
    },


}