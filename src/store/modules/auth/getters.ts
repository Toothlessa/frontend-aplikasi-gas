import { GET_USER_TOKEN_GETTER, IS_USER_AUTHENTICATE_GETTER } from "@/store/storeconstant";
import { RootState } from "@/store/types";
import { AuthState } from "@/types/Auth";
import { GetterTree } from "vuex";

const getters: GetterTree<AuthState, RootState> = {
    [GET_USER_TOKEN_GETTER]: (state) => {
    return state.authUser?.token;
  },

  [IS_USER_AUTHENTICATE_GETTER]: (state) => {
    return !!state.authUser?.token;
  },
}

export default getters;