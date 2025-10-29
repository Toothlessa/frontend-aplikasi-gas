import { RootState } from '@/store/types';
import { StockState } from '@/types';
import { GetterTree } from 'vuex';

const getters: GetterTree<StockState, RootState> = {
    stocks: (state) => state.stocks,
    
    loading: (state) => state.loading,
    loadingDetail: (state) => state.loadingDetail,
    hasSaved: (state) => state.hasSaved,
};

export default getters;
