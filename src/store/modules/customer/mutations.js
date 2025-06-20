import {
    SET_DATA_CUSTOMER,
    SET_LOADING,
    SET_ERROR,
    SET_SUCCESS_MESSAGE,
    SET_HASSAVED,
} from "@/store/storeconstant";

export default {
    [SET_DATA_CUSTOMER](state, payload) {
        state.customers = payload;
    },
    [SET_LOADING](state, loading) {
        state.loading = loading;
    },
    [SET_ERROR](state, error) {
        state.error = error;
    },
    [SET_SUCCESS_MESSAGE](state, successMessage) {
        state.successMessage = successMessage;
    },
    [SET_HASSAVED](state, hasSaved) {
        state.hasSaved = hasSaved;
    },
}