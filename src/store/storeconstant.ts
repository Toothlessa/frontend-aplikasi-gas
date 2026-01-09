/* GLOBAL VARIABEL */

/*mutations*/
export const SET_LOADING = '[mutations] set loading data succesfully load for tables'
export const SET_LOADING_ONE = '[mutations] set loading data one succesfully load for tables'
export const SET_LOADING_BUTTON_CREATE = '[mutations] set loading button for create'
export const SET_LOADING_BUTTON_UPDATE = '[mutations] set loading button for update'
export const SET_ERROR = '[mutations] set error'
export const SET_SUCCESS_MESSAGE = '[mutations] set success message'
export const SET_HASSAVED = '[mutations] set has saved data'


/* AUTHENTICATION */ /* actions */
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

/* MASTER ITEM */ /* actions */
export const CREATE_ITEM = '[actions] create master item'
export const CREATE_CATEGORY_ITEM = '[actions] create category item'
export const LOAD_MASTER_ITEM = '[actions] load master item data'
export const LOAD_MASTER_ITEM_BY_TYPE = '[actions] load master item data by item type'
export const LOAD_CATEGORY_ITEM = '[actions] load category item data'
export const DEACTIVATE_ITEM = '[actions] deactivate item data'
export const DEACTIVATE_ITEM_CATEGORY = '[actions] deactivate item category data'
/* getters */
/* mutations */
export const SET_DATA_MITEM = '[mutations] set master item data'
export const SET_DATA_MITEM_BY_TYPE = '[mutations] set master item data by item type'
export const SET_DATA_CATEGORY = '[mutations] set category item data'

/* CUSTOMER *//* actions */
export const CREATE_CUSTOMER = '[actions] create customer'
export const UPDATE_CUSTOMER = '[actions] update customer'
export const LOAD_CUSTOMER_DATA = '[actions] load data customers'
export const LOAD_TOP_CUSTOMER_TRANSACTION = '[actions] load top 10 customer data'
export const DEACTIVATE_CUSTOMER = '[actions] deactivate customer'
export const UPLOAD_CUSTOMER = '[actions] upload customer data'
/* getters */
/* mutations */
export const SET_DATA_CUSTOMER = '[mutations] set all data customers'
export const SET_DATA_TOP_CUSTOMER = '[mutations] set data top 10 customer transactions'
/* ASSET */ /* actions */
export const CREATE_ASSET = '[actions] create asset'
export const LOAD_ASSET = '[actions] load data asset'
export const DEACTIVE_ASSET = '[actions] deactivate asset'
export const CREATE_OWNER = '[actions] create owner'
export const LOAD_OWNER = '[actions] load owner'
export const DEACTIVE_OWNER = '[actions] deactivate owner'
export const LOAD_ASSET_DETAILS_BY_SUMMARY = '[actions] load asset details by summary'
/* getters */
/* mutations */
export const SET_DATA_ASSET = '[mutations] set all data asset'
export const SET_DATA_OWNER = '[mutations] set data owner'
export const SET_DATA_ASSET_DETAIL = '[mutations] set data asset detail'
export const RESET_DETAIL_ASSET = '[mutations] reset detail asset'

/* STOCK */ /* actions */
export const CREATE_STOCK = '[actions] create stock'
export const LOAD_STOCK = '[actions] load data stock'
export const LOAD_DETAIL_STOCK = '[actions] load data detail stock'
export const LOAD_DISPLAY_STOCK = '[actions] load data for display stock in dashboard'
export const UPDATE_STOCK = '[actions] update data stock'
/* mutations */
export const SET_LOADING_DETAIL_STOCK = '[mutations] set loading for detail stock'
export const SET_DATA_STOCK = '[mutations] set all data stock'
export const SET_DETAIL_DATA_STOCK = '[mutations] set all detail data stock'
export const SET_DATA_DISPLAY_STOCK = '[mutations] set data for displaying stock'
export const RESET_DETAIL_STOCK = '[mutations] reset detail stock'

/* TRANSACTION */ /* actions */
export const CREATE_TRANSACTION = '[actions] create data transaction'
export const LOAD_TRANSACTION_BY_DATE = '[actions] load data transaction with parameter date'
export const LOAD_OUTSTANDING_TRANSACTION = '[actions] load outstanding transaction data'
export const LOAD_LAST_30_DAYS_TRANSACTION = '[actions] load 30 days transaction data'
/* mutations */
export const SET_DATA_TRANSACTION = '[mutations] set all data transactions'
export const SET_DATA_OUTSTANDING_TRANSACTION = '[mutations] set data outstanding transaction'
export const SET_DATA_LAST_30_DAYS_TRANSACTION = '[mutations] set data last 30 days transaction'

/* DEBT */ /* actions */
export const CREATE_DEBT = '[actions] create data debt'
export const UPDATE_DEBT = '[actions] update data debt'
export const LOAD_DATA_DEBT = '[actions] load data detail debt by customer'
export const LOAD_DATA_SUMMARY_DEBT = '[actions] load data summary debt group by customer'
export const LOAD_DATA_OUTSTANDING_DEBT = '[actions] load data outstanding debt'
/* mutations */
export const SET_DATA_DEBT = '[mutations] set all data debt'
export const SET_DATA_SUMMARY_DEBT = '[mutations] set all data summary debt'
export const SET_DATA_OUTSTANDING_DEBT = '[mutations] set all data outstanding debt'
export const RESET_DETAIL_DEBT = '[mutations] reset detail debt'

/* USER */ /* actions */
export const LOAD_CURRENT_USER = '[actions] load current user'
export const UPDATE_CURRENT_USER = '[actions] update current user'
/* mutations */
export const SET_DATA_CURRENT_USER = '[mutations] set data current'