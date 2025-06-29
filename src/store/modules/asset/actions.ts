import axios from 'axios';
import {
  CREATE_OWNER,
  GET_USER_TOKEN_GETTER,
  LOAD_ASSET,
  LOAD_OWNER,
  SET_DATA_ASSET,
  SET_DATA_OWNER,
  SET_HASSAVED,
  SET_LOADING,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { ActionContext, ActionTree } from 'vuex';
import { RootState } from '@/store/types'; // ← create this file too
import { Asset, AssetState, Owner } from '@/types';

type Context = ActionContext<AssetState,  RootState>;

const actions: ActionTree<AssetState, RootState> = {

  async [LOAD_ASSET]({ commit }: Context): Promise<void> {
    try {

      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
      const response = await axios.get('http://127.0.0.1:8000/api/masteritems/itemtype/' + 'ASSET', {
        headers: {
          Authorization: token,
        },
      });

      const data: Asset[] = response.data.data;

      commit(SET_DATA_ASSET, data);
    } catch (error: any) {
      throw Validations.getErrorMessageFromCodeCustomer(error.response?.data?.errors?.[0]);
    } 
  },

  async [LOAD_OWNER]({ commit }: Context): Promise<void> {
    try {

      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
      const response = await axios.get('http://127.0.0.1:8000/api/assetowners/all', {
        headers: {
          Authorization: token,
        },
      });

      const data: Owner[] = response.data.data;

      commit(SET_DATA_OWNER, data);
    } catch (error: any) {
      throw Validations.getErrorMessageFromCodeCustomer(error.response?.data?.errors?.[0]);
    } 
  },

  async [CREATE_OWNER](
    { dispatch, commit }: Context, asset: Asset
  ): Promise<void> {
    try {
      const url = asset.id
        ? `http://127.0.0.1:8000/api/assetowners/'${asset.id}`
        : 'http://127.0.0.1:8000/api/assetowners';

      const method: 'put' | 'post' = asset.id ? 'put' : 'post';

      const response = await axios[method](url, asset, {
        headers: {
          Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });

      if ([200, 201].includes(response.status)) {
        dispatch(LOAD_OWNER);
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
              Validations.getErrorMessageFromCodeCustomer(message)
            );
          }
        }

        throw messages;
      }
    }
  },

};

export default actions;
