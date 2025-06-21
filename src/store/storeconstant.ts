/* AUTHENTICATION */
/* actions */
export const SIGNUP_ACTION = '[actions] signup user'
export const LOGIN_ACTION = '[actions] login user'
export const AUTH_ACTION = '[actions] do login user auth'
export const AUTO_LOGIN_ACTION = '[actions] auto login'
export const LOGOUT_ACTION = '[actions] do logout actions'
export const AUTO_LOGOUT_ACTION = '[actions] auto logout'
/* getters */
export const GET_USER_TOKEN_GETTER = '[getters] get user data token'
export const IS_USER_AUTHENTICATE_GETTER = '[getters] check user have token'
/* mutations */
export const SET_USER_TOKEN_DATA_MUTATION = '[mutations] set user data token'
export const SET_AUTO_LOGOUT_MUTATION = '[mutations] set autlogout true'

/* GLOBAL VARIABEL */
export const SET_LOADING = '[mutations] set data succesfully load'
export const SET_ERROR = '[mutations] set error'
export const SET_SUCCESS_MESSAGE = '[mutations] set success message'
export const SET_HASSAVED = '[mutations] set has saved data'

/* MASTER ITEM */
/* actions */
export const CREATE_ITEM = '[actions] create master item'
export const CREATE_CATEGORY_ITEM = '[actions] create category item'
export const LOAD_MASTER_ITEM = '[actions] load master item data'
export const LOAD_CATEGORY_ITEM = '[actions] load category item data'
export const DEACTIVATE_ITEM = '[actions] deactivate customer'

/* getters */

/* mutations */
export const SET_DATA_MITEM = '[mutations] set master item data'
export const SET_DATA_CATEGORY = '[mutations] set category item data'

/* CUSTOMER */
/* actions */
export const CREATE_CUSTOMER = '[actions] create customer'
export const LOAD_CUSTOMER_DATA = '[actions] load data customers'
export const DEACTIVATE_CUSTOMER = '[actions] deactivate customer'
export const UPLOAD_CUSTOMER = '[actions] upload customer data'

/* getters */

/* mutations */
export const SET_DATA_CUSTOMER = '[mutations] set all data customers'