import { RootState } from "@/store/types";
import { DebtState } from "@/types";
import { GetterTree } from "vuex";

const getters: GetterTree<DebtState, RootState> = {
//     //data transaction
//     transactions: (state) => state.transactions,
//     //value
//     loading:(state) => state.loading,
//     loadingButtonCreate: (state) => state.loadingButtonCreate,
//     loadingButtonUpdate: (state) => state.loadingButtonUpdate,
//     hasSaved: (state) => state.hasSaved,
};

export default getters;