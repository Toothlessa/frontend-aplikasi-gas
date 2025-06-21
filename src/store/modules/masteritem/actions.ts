import axios from 'axios';
import {
  GET_USER_TOKEN_GETTER,
  LOAD_MASTER_ITEM,
  LOAD_CATEGORY_ITEM,
  CREATE_ITEM,
  CREATE_CATEGORY_ITEM,
  SET_DATA_MITEM,
  SET_LOADING,
  SET_HASSAVED,
  SET_DATA_CATEGORY,
  DEACTIVATE_ITEM,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { ActionContext, ActionTree } from 'vuex';
import { MasterItemState, MasterItem, CategoryItem } from '@/types/masteritem';
import { RootState } from '@/store/types'; // ← create this file too

type Context = ActionContext<MasterItemState,  RootState>;

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
        in_stock: item.in_stock === 'Y',
      }));

      commit(SET_DATA_MITEM, data);
    } catch (error: any) {
      throw Validations.getErrorMessageFromCodeMasterItem(error.response?.data?.errors?.[0]);
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [LOAD_CATEGORY_ITEM]({ commit }: Context): Promise<void> {
    commit(SET_LOADING, true);
    try {

      const url = `http://127.0.0.1:8000/api/categoryitems/all`;
      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
      
      const response = await axios.get(url, {
        headers: {
          Authorization: token,
        },
      });

      const data: CategoryItem[] = response.data.data.map((item: any) => ({
        ...item,
        active_flag: item.active_flag === 'Y',
      }));

      commit(SET_DATA_CATEGORY, data);
    } catch (error: any) {
      throw Validations.getErrorMessageFromCodeMasterItem(error.response?.data?.errors?.[0]);
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [CREATE_ITEM](
    { dispatch, commit }: Context, masteritem: MasterItem
  ): Promise<void> {
    try {
      const url = masteritem.id
        ? `http://127.0.0.1:8000/api/masteritems/${masteritem.id}`
        : 'http://127.0.0.1:8000/api/masteritems';

      const method: 'put' | 'post' = masteritem.id ? 'put' : 'post';

      const response = await axios[method](url, masteritem, {
        headers: {
          Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });

      if ([200, 201].includes(response.status)) {
        dispatch(LOAD_MASTER_ITEM);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const messages: string[] = [];

        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            const message = errors[field][0];
            messages.push(
              Validations.getErrorMessageFromCodeMasterItem(message)
            );
          }
        }

        throw messages;
      }
    }
  },

  async [DEACTIVATE_ITEM](
    { dispatch, commit }: Context, id
  ): Promise<void> {
    try {
      const url = `http://127.0.0.1:8000/api/masteritems/inactive/${id}`;

      const response = await axios.patch(url, [], {
        headers: {
          Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });

      if ([200].includes(response.status)) {
        dispatch(LOAD_MASTER_ITEM);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const messages: string[] = [];

        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            const message = errors[field][0];
            messages.push(
              Validations.getErrorMessageFromCodeMasterItem(message)
            );
          }
        }

        throw messages;
      }
    }
  },

   async [CREATE_CATEGORY_ITEM](
    { dispatch, commit }: Context, categoryitem: CategoryItem
  ): Promise<void> {
    try {
      const url = `http://127.0.0.1:8000/api/categoryitems`;

      const response = await axios.post(url, categoryitem, {
        headers: {
          Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });

      if ([201].includes(response.status)) {
        dispatch(LOAD_CATEGORY_ITEM);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const messages: string[] = [];

        for (const field in errors) {
          if (Array.isArray(errors[field])) {
            const message = errors[field][0];
            messages.push(
              Validations.getErrorMessageFromCodeMasterItem(message)
            );
          }
        }

        throw messages;
      }
    }
  },

};

export default actions;
