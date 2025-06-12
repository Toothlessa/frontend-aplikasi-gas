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


/* MASTER ITEM */
/* actions */
export const CREATE_MASTERITEM_ACTION = '[actions] create master item action'
export const GET_MASTERITEM_ACTION = '[actions] create master item action'

/* getters */

/* mutations */

/* CUSTOMER */
/* actions */
export const LOAD_CUSTOMER_DATA = '[actions] load data customers'

/* getters */
export const GET_DATA_CUSTOMER = '[actions] get all data customers'
export const GET_LOADING = '[actions] get all data customers'
export const GET_ERROR = '[actions] get all data customers'
export const GET_SUCCESS_MESSAGE = '[actions] get all data customers'

/* mutations */
export const SET_DATA_CUSTOMER = '[mutations] set all data customers'
export const SET_LOADING = '[mutations] set data succesfully load'
export const SET_ERROR = '[mutations] set error'
export const SET_SUCCESS_MESSAGE = '[mutations] set success message'