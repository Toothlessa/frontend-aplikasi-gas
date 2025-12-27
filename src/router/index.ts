import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store/store";
import { IS_USER_AUTHENTICATE_GETTER } from "@/store/storeconstant";
import { UserApi } from "@/api/UserApi";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

/* ----------------------------------------------------
 * Lazy Loaded Components
 * ---------------------------------------------------- */
const Login = () => import("@/views/auth/LoginView.vue");
const Dashboard = () => import("@/views/dashboard/index.vue");
const User = () => import("@/views/users/UserView.vue");
const MasterItem = () => import("@/views/masteritem/MasterItemView.vue");
const Customer = () => import("@/views/customers/CustomerView.vue");
const Transaction = () => import("@/views/transaction/TransactionView.vue");
const Stock = () => import("@/views/stocks/StockView.vue");
const Debt = () => import("@/views/debts/DebtView.vue");
const Asset = () => import("@/views/assets/AssetView.vue");
const AssetDetails = () => import("@/components/assets/AssetDetails.vue");

/* ----------------------------------------------------
 * Routes Configuration
 * ---------------------------------------------------- */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { auth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { auth: false, hideTheNavigation: true },
  },
  {
    path: "/users",
    name: "Users",
    component: User,
    meta: { auth: true },
  },
  {
    path: "/masteritem",
    name: "MasterItem",
    component: MasterItem,
    meta: { auth: true },
  },
  {
    path: "/customer",
    name: "Customer",
    component: Customer,
    meta: { auth: true },
  },
  {
    path: "/transaction",
    name: "Transaction",
    component: Transaction,
    meta: { auth: true },
  },
  {
    path: "/stock",
    name: "Stock",
    component: Stock,
    meta: { auth: true },
  },
  {
    path: "/debt",
    name: "Debt",
    component: Debt,
    meta: { auth: true },
  },
  {
    path: "/asset",
    name: "Asset",
    component: Asset,
    meta: { auth: true },
  },
  {
    path: "/asset/:owner_id/:item_id",
    name: "AssetDetails",
    component: AssetDetails,
    props: true,
    meta: { auth: true },
  },
];

/* ----------------------------------------------------
 * Router Instance
 * ---------------------------------------------------- */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* ----------------------------------------------------
 * Navigation Guard
 * ---------------------------------------------------- */
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _,
    next: NavigationGuardNext
  ) => {
    const isAuthenticated = store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`];

    // 1. Jika halaman butuh auth tapi belum login
    if (to.meta.auth && !isAuthenticated) {
      return next("/login");
    }

    // 2. Validasi token ke server jika halaman butuh auth
    if (to.meta.auth) {
      try {
        await UserApi.fetchCurrentUser();
      } catch (error: any) {
        if (error?.response?.status === 401) {
          console.log("AUTO LOGOUT: ", error.response.status);
          localStorage.removeItem("userData");
          return next("/login");
        }
      }
    }

    // 3. Cegah user yang sudah login masuk ke halaman login
    if (to.path === "/login" && isAuthenticated) {
      try {
        await UserApi.fetchCurrentUser();
        return next("/");
      } catch (error: any) {
        if (error?.response?.status === 401) {
          localStorage.removeItem("userData");
        }
      }
    }

    return next();
  }
);

export default router;
