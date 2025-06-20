import { 
    SET_DATA_MITEM,
    SET_LOADING, 
    SET_HASSAVED, 
} from "@/store/storeconstant";


export default {
    [SET_DATA_MITEM](state, payload) {
            state.mItems = payload;
    },
    [SET_LOADING](state, loading) {
        state.loading = loading;
    },
    [SET_HASSAVED](state, hasSaved) {
        state.hasSaved = hasSaved;
    },
}