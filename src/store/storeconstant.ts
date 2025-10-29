/* AUTHENTICATION */
/* actions */
export const SIGNUP_ACTION              = '[actions] signup user'
export const LOGIN_ACTION               = '[actions] login user'
export const AUTH_ACTION                = '[actions] do login user auth'
export const AUTO_LOGIN_ACTION          = '[actions] auto login'
export const LOGOUT_ACTION              = '[actions] do logout actions'
export const AUTO_LOGOUT_ACTION         = '[actions] auto logout'
/* getters */
export const GET_USER_TOKEN_GETTER          = '[getters] get user data token'
export const IS_USER_AUTHENTICATE_GETTER    = '[getters] check user have token'
/* mutations */
export const SET_USER_TOKEN_DATA_MUTATION   = '[mutations] set user data token'
export const SET_AUTO_LOGOUT_MUTATION       = '[mutations] set autlogout true'

/* GLOBAL VARIABEL */
export const SET_LOADING                = '[mutations] set data succesfully load'
export const SET_ERROR                  = '[mutations] set error'
export const SET_SUCCESS_MESSAGE        = '[mutations] set success message'
export const SET_HASSAVED               = '[mutations] set has saved data'

/* MASTER ITEM */ /* actions */
export const CREATE_ITEM                = '[actions] create master item'
export const CREATE_CATEGORY_ITEM       = '[actions] create category item'
export const LOAD_MASTER_ITEM           = '[actions] load master item data'
export const LOAD_CATEGORY_ITEM         = '[actions] load category item data'
export const DEACTIVATE_ITEM            = '[actions] deactivate item data'
export const DEACTIVATE_ITEM_CATEGORY   = '[actions] deactivate item category data'

/* getters */

/* mutations */
export const SET_DATA_MITEM     = '[mutations] set master item data'
export const SET_DATA_CATEGORY  = '[mutations] set category item data'

/* CUSTOMER */
/* actions */
export const CREATE_CUSTOMER    = '[actions] create customer'
export const UPDATE_CUSTOMER    = '[actions] update customer' 
export const LOAD_CUSTOMER_DATA     = '[actions] load data customers'
export const DEACTIVATE_CUSTOMER    = '[actions] deactivate customer'
export const UPLOAD_CUSTOMER    = '[actions] upload customer data'

/* getters */

/* mutations */
export const SET_DATA_CUSTOMER  = '[mutations] set all data customers'

/* ASSET */ /* actions */
export const CREATE_ASSET       = '[actions] create asset'
export const LOAD_ASSET         = '[actions] load data asset'
export const DEACTIVE_ASSET     = '[actions] deactivate asset'

export const CREATE_OWNER       = '[actions] create owner'
export const LOAD_OWNER         = '[actions] load owner'
export const DEACTIVE_OWNER     = '[actions] deactivate owner'
export const LOAD_ASSET_DETAILS_BY_SUMMARY          = '[actions] load asset details by summary'
export const UPDATE_ASSET       = '[actions] update asset'

/* getters */

/* mutations */
export const SET_DATA_ASSET     = '[mutations] set all data asset'
export const SET_DATA_OWNER     = '[mutations] set data owner'

/* STOCK */ /* actions */
export const CREATE_STOCK       = '[actions] create stock'
export const LOAD_STOCK         = '[actions] load data stock'
export const LOAD_DETAIL_STOCK  = '[actions] load data detail stock'
export const UPDATE_STOCK       = '[actions] update data stock'

/* mutations */
export const SET_LOADING_DETAIL_STOCK = '[mutations] set loading for detail stock'

export const SET_DATA_STOCK     = '[mutations] set all data stock'
export const SET_DETAIL_DATA_STOCK ='[mutations] set all detail data stock'
