import {
    SET_DATA_CUSTOMER,
    SET_LOADING,
    SET_ERROR,
    SET_SUCCESS_MESSAGE,
} from "@/store/storeconstant";

export default {
    [SET_DATA_CUSTOMER](state, customers) {
        state.customers = customers;
    },
    [SET_LOADING](state, loading) {
        state.customers = loading;
    },
    [SET_ERROR](state, error) {
        state.error = error;
    },
    [SET_SUCCESS_MESSAGE](state, message) {
        state.message = message;
    },
}