import { 
    SET_DATA_MITEM,
    SET_LOADING, 
    SET_HASSAVED,
    SET_DATA_CATEGORY, 
} from "@/store/storeconstant";


export default {
    [SET_DATA_MITEM](state, payload) {
            state.mItems = payload;
    },
    [SET_DATA_CATEGORY](state, payload) {
            state.categories = payload;
    },
    [SET_LOADING](state, loading) {
        state.loading = loading;
    },
    [SET_HASSAVED](state, hasSaved) {
        state.hasSaved = hasSaved;
    },
}