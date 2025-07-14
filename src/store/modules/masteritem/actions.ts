import AxiosInstance from '@/services/AxiosInstance';
import { AxiosResponse } from 'axios';
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
  DEACTIVATE_ITEM_CATEGORY,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { ActionContext, ActionTree } from 'vuex';
import { MasterItemState, MasterItem, CategoryItem, RawMasterItem, RawCategoryItem } from '@/types/MasterItem';
import { RootState } from '@/store/types'; // ← create this file too

type Context = ActionContext<MasterItemState,  RootState>;

const actions: ActionTree<MasterItemState, RootState> = {
  
  async [LOAD_MASTER_ITEM]({ commit }: Context): Promise<void> {
    commit(SET_LOADING, true);
    try {

      const response: AxiosResponse<{ data: RawMasterItem[] }> = await AxiosInstance.get('masteritems/all');

      const data: MasterItem[] = response.data.data.map((item) => ({
        ...item,
        active_flag: item.active_flag === 'Y',
        in_stock: item.in_stock === 'Y',
      }));

      commit(SET_DATA_MITEM, data);
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] } } };
      throw Validations.getErrorMessageFromCodeMasterItem(axiosError.response?.data?.errors?.[0]);
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [LOAD_CATEGORY_ITEM]({ commit }: Context): Promise<void> {
    commit(SET_LOADING, true);
    try {

      const response: AxiosResponse<{ data: RawCategoryItem[] }> = await AxiosInstance.get('categoryitems/all');

      const data: CategoryItem[] = response.data.data.map((item) => ({
        ...item,
        active_flag: item.active_flag === 'Y',
      }));

      commit(SET_DATA_CATEGORY, data);
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] } } };
      throw Validations.getErrorMessageFromCodeMasterItem(axiosError.response?.data?.errors?.[0]);
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [CREATE_ITEM](
    { dispatch, commit }: Context, masteritem: MasterItem
  ): Promise<void> {
    try {
      const url = masteritem.id
        ? `masteritems/${masteritem.id}`
        : 'masteritems';

      const method: 'put' | 'post' = masteritem.id ? 'put' : 'post';

      const response = await AxiosInstance[method](url, masteritem);

      if ([200, 201].includes(response.status)) {
        dispatch(LOAD_MASTER_ITEM);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: { [key: string]: string[] } } } };
      const errors = axiosError.response?.data?.errors;
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
    { dispatch, commit }: Context, id: number
  ): Promise<void> {
    try {
      const url = `masteritems/inactive/${id}`;

      const response = await AxiosInstance.patch(url, []);

      if ([200].includes(response.status)) {
        dispatch(LOAD_MASTER_ITEM);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: { [key: string]: string[] } } } };
      const errors = axiosError.response?.data?.errors;
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
      const url = categoryitem.id
        ? `categoryitems/${categoryitem.id}`
        : 'categoryitems';

      const method: 'patch' | 'post' = categoryitem.id ? 'patch' : 'post';

      const response = await AxiosInstance[method](url, categoryitem);

      if ([200, 201].includes(response.status)) {
        dispatch(LOAD_CATEGORY_ITEM);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: { [key: string]: string[] } } } };
      const errors = axiosError.response?.data?.errors;
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

   async [DEACTIVATE_ITEM_CATEGORY](
    { dispatch, commit }: Context, id: number
  ): Promise<void> {
    try {
      const url = `categoryitems/inactive/${id}`;

      const response = await AxiosInstance.patch(url, []);

      if ([200].includes(response.status)) {
        dispatch(LOAD_CATEGORY_ITEM);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: { [key: string]: string[] } } } };
      const errors = axiosError.response?.data?.errors;
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
