import {
    createRouter,
    createWebHistory
} from 'vue-router'
const Login = () => import( /* webpackChunkName: "Login" */ '@/views/auth/LoginView.vue');
const Dashboard = () => import('@/views/dashboard');
const User = () => import('@/views/users/UserView.vue');
const MasterItem = () => import('@/views/masteritem/MasterItemView.vue')
const Customer = () => import('@/views/customers/CustomerView.vue')
const Transaction = () => import('@/views/transaction/TransactionView.vue')
const Stock = () => import('@/views/stocks/StockView.vue')
const Debt = () => import('@/views/debts/DebtView.vue')
const Asset = () => import('@/views/assets/AssetView.vue')
const AssetDetails = () => import('@/components/assets/AssetDetails.vue')

import store from '@/store/store'
import {
    IS_USER_AUTHENTICATE_GETTER
} from '@/store/storeconstant'

const routes = [{
        path: '/',
        component: Dashboard,
        meta: {
            auth: true,
        }
    },
    {
        path: '/login',
        component: Login,
        name: Login,
        meta: {
            auth: false,
            hideTheNavigation: true,
        }
    },
    {
        path: '/users',
        component: User,
        meta: {
            auth: true
        }
    },
    {
        path: '/masteritem',
        component: MasterItem,
        meta: {
            auth: true
        }
    },
    {
        path: '/customer',
        component: Customer,
        meta: {
            auth: true
        }
    },
    {
        path: '/transaction',
        component: Transaction,
        meta: {
            auth: true
        }
    },
    {
        path: '/stock',
        component: Stock,
        meta: {
            auth: true
        }
    },
    {
        path: '/debt',
        component: Debt,
        meta: {
            auth: true
        }
    },
    {
        path: '/asset',
        component: Asset,
        meta: {
            auth: true
        }
    },
    {
        path: '/asset/:ownerId/:assetName',
        name: 'AssetDetails',
        component: AssetDetails,
        meta: {
            auth: true
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (
        'auth' in to.meta &&
        to.meta.auth &&
        !store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`]
    ) {
        next('/login');
    } else if (
        'auth' in to.meta &&
        !to.meta.auth &&
        store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`]
    ) {
        next('/login'); //default /
    } else {
        next();
    }
});

export default router