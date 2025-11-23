import {
    createStore
} from 'vuex'
import auth from './modules/auth/index'
import customer from './modules/customer/index';
import masteritem from './modules/masteritem/index';
import asset from './modules/asset/index';
import stock from './modules/stock/index';
import transaction from './modules/transaction/index';
import debt from './modules/debt/index';
import user from './modules/user/index';


const store = createStore({
    modules: {
        auth,
        customer,
        masteritem,
        asset,
        stock,
        transaction,
        debt,
        user,
    },
});

export default store;