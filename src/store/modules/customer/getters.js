import {
    GET_DATA_CUSTOMER,
    GET_LOADING,
    GET_ERROR,
    GET_SUCCESS_MESSAGE,
} from "@/store/storeconstant";

export default {
    [GET_DATA_CUSTOMER]: (state) => {
        return state.customers;
    },
    [GET_LOADING]: (state) => {
        return state.loading;
    },
    [GET_ERROR]: (state) => {
        return state.error;
    },
    [GET_SUCCESS_MESSAGE]: (state) => {
        return state.successMessage;
    },
};