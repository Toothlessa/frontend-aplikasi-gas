import {
    createStore
} from 'vuex'
import auth from './modules/auth/index'
import customer from './modules/customer/index';
import masteritem from './modules/masteritem/index';
import asset from './modules/asset/index';
import stock from './modules/stock';

const store = createStore({
    modules: {
        auth,
        customer,
        masteritem,
        asset,
        stock,
    },
});

export default store;