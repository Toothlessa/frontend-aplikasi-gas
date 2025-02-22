import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default {
    namespaced: true,
    state() {
        return {
            userId: '',
            email: '',
            token: '',
            expiresIn: 'sdsds',
            autoLogout: false,
        };
    },
    mutations,
    getters,
    actions,
}