import {
    createStore
} from 'vuex'
import auth from './modules/auth/index'
import customer from './modules/customer/index';

const store = createStore({
    modules: {
        auth,
        customer,
    },
});

export default store;