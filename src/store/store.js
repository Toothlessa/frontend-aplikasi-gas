import {
    createStore
} from 'vuex'
import auth from './modules/auth/index'
import customer from './modules/customer/index';
import masteritem from './modules/masteritem/index';

const store = createStore({
    modules: {
        auth,
        customer,
        masteritem,
    },
});

export default store;