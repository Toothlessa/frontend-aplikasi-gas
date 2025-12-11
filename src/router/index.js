import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/store";
import { IS_USER_AUTHENTICATE_GETTER } from "@/store/storeconstant";
import { UserApi } from "@/api/UserApi";

const Login = () =>
  import(/* webpackChunkName: "Login" */ "@/views/auth/LoginView.vue");
const Dashboard = () => import("@/views/dashboard");
const User = () => import("@/views/users/UserView.vue");
const MasterItem = () => import("@/views/masteritem/MasterItemView.vue");
const Customer = () => import("@/views/customers/CustomerView.vue");
const Transaction = () => import("@/views/transaction/TransactionView.vue");
const Stock = () => import("@/views/stocks/StockView.vue");
const Debt = () => import("@/views/debts/DebtView.vue");
const Asset = () => import("@/views/assets/AssetView.vue");
const AssetDetails = () =>
  import("@/components/assets/AssetDetails.vue");

  /* ----------------------------------------------------
   * Router Configuration
   * ---------------------------------------------------- */
const routes = [
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
    meta: {
      auth: false,
      hideTheNavigation: true,
    },
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
    path: "/asset/:ownerId/:itemId",
    name: "AssetDetails",
    component: AssetDetails,
    props: true,
    meta: { auth: true },
  },
];

  /* ----------------------------------------------------
   * router
   * ---------------------------------------------------- */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

  /* ----------------------------------------------------
   * Navigation Guard
   * ---------------------------------------------------- */
router.beforeEach(async (to, _, next) => {
  
  const isAuthenticated = store.getters[`auth/${IS_USER_AUTHENTICATE_GETTER}`];
  if (to.meta.auth && !isAuthenticated) {
    return next("/login"); 
  } 

  if (to.meta.auth) {
    try {
      await UserApi.fetchCurrentUser(); // jika token invalid, akan masuk catch
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("AUTO LOGOUT: ", error.response.status);
        localStorage.removeItem("userData");
        return next("/login")
      }
    }
  }

  return next();
});



export default router;
