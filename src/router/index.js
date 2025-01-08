import {
    createRouter,
    createWebHistory
} from 'vue-router'
const Login = () => import( /* webpackChunkName: "Login" */ '@/views/auth/LoginView.vue');
const Dashboard = () => import('@/views/dashboard');
const User = () => import('@/views/users/UserView.vue');
const MasterItem = () => import('@/views/masteritems/MasterItemView.vue')

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
        next('/');
    } else {
        next();
    }
});

export default router