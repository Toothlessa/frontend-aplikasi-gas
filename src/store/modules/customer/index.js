import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default {
    namespaced: true,
    state() {
        return {
            customers: [],
            loading: false,
            error: null,
            successMessage: null,
        };
    },
    mutations,
    getters,
    actions,
}