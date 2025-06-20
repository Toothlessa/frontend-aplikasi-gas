import axios from 'axios';
import {
  GET_USER_TOKEN_GETTER,
  LOAD_MASTER_ITEM,
  SET_DATA_MITEM,
  SET_LOADING,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { ActionContext, ActionTree } from 'vuex';
import { MasterItemState, MasterItem } from '@/types/masteritem';
import { RootState } from '@/store/types'; // ← create this file too

type Context = ActionContext<MasterItemState, RootState>;

const actions: ActionTree<MasterItemState, RootState> = {
  async [LOAD_MASTER_ITEM]({ commit }: Context): Promise<void> {
    commit(SET_LOADING, true);
    try {
      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];

      const response = await axios.get('http://127.0.0.1:8000/api/masteritems/all', {
        headers: {
          Authorization: token,
        },
      });

      const data: MasterItem[] = response.data.data.map((item: any) => ({
        ...item,
        active_flag: item.active_flag === 'Y',
      }));

      commit(SET_DATA_MITEM, data);
    } catch (error: any) {
      throw Validations.getErrorMessageFromCodeMasterItem(error.response?.data?.errors?.[0]);
    } finally {
      commit(SET_LOADING, false);
    }
  },
};

export default actions;
