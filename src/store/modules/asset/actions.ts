import axios, { AxiosResponse } from 'axios';
import {
  CREATE_ASSET,
  CREATE_OWNER,
  DEACTIVE_OWNER,
  GET_USER_TOKEN_GETTER,
  LOAD_ASSET,
  LOAD_OWNER,
  SET_DATA_ASSET,
  SET_DATA_OWNER,
  SET_HASSAVED,
  LOAD_ASSET_DETAILS_BY_SUMMARY,
  UPDATE_ASSET,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { ActionContext, ActionTree } from 'vuex';
import { RootState } from '@/store/types'; // ← create this file too
import { Asset, AssetState, Owner, RawOwner } from '@/types';

type Context = ActionContext<AssetState,  RootState>;

const actions: ActionTree<AssetState, RootState> = {

  async [LOAD_ASSET]({ commit }: Context): Promise<void> {
    try {

      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
      const response: AxiosResponse<{ data: Asset[] }> = await axios.get('http://127.0.0.1:8000/api/assets/summary', {
        headers: {
          'Authorization': token,
        },
      });

      const data: Asset[] = response.data.data;
      commit(SET_DATA_ASSET, data);
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] } } };
      throw Validations.getErrorMessageFromCodeCustomer(axiosError.response?.data?.errors?.[0]);
    } 
  },

  async [LOAD_OWNER]({ commit }: Context): Promise<void> {
    try {
      
      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
      const response: AxiosResponse<{ data: RawOwner[] }> = await axios.get('http://127.0.0.1:8000/api/assetowners/all', {
        headers: {
          Authorization: token,
        },
      });

      const data: Owner[] = response.data.data.map((owner) => ({
        ...owner,
        active_flag: owner.active_flag === 'Y',
      }));

      commit(SET_DATA_OWNER, data);
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] } } };
      throw Validations.getErrorMessageFromCodeCustomer(axiosError.response?.data?.errors?.[0]);
    } 
  },

  async [CREATE_OWNER](
    { dispatch, commit }: Context, owner: Owner
  ): Promise<void> {
    try {
      const url = owner.id
        ? `http://127.0.0.1:8000/api/assetowners/${owner.id}`
        : 'http://127.0.0.1:8000/api/assetowners';

      const method: 'patch' | 'post' = owner.id ? 'patch' : 'post';

      const response = await axios[method](url, owner, {
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
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: { [key: string]: string[] } } } };
      const errors = axiosError.response?.data?.errors;
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

  async [CREATE_ASSET](
    { dispatch, commit }: Context, asset: Asset
  ): Promise<void> {
    try {
      const url = asset.id
        ? `http://127.0.0.1:8000/api/assets/${asset.id}`
        : 'http://127.0.0.1:8000/api/assets';

      const method: 'put' | 'post' = asset.id ? 'put' : 'post';
      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];

      const response = await axios[method](url, asset, {
        headers: {
          Authorization: token,
        },
      });

      if ([200, 201].includes(response.status)) {
        dispatch(LOAD_ASSET);
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
              Validations.getErrorMessageFromCodeCustomer(message)
            );
          }
        }

        throw messages;
      }
    }
  },

  async [DEACTIVE_OWNER](
    { dispatch, commit }: Context, id: number
  ): Promise<void> {
    try {
      const url = `http://127.0.0.1:8000/api/assetowners/inactive/${id}`;

      const response = await axios.patch(url, [], {
        headers: {
          Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });

      if ([200].includes(response.status)) {
        dispatch(LOAD_OWNER);
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

  async [LOAD_ASSET_DETAILS_BY_SUMMARY](
    { commit }: Context, { ownerId, assetName }: { ownerId: string; assetName: string }
  ): Promise<void> {
    try {
      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
      const response: AxiosResponse<{ data: Asset[] }> = await axios.get(
        `http://127.0.0.1:8000/api/assets/details/${ownerId}/assets/${assetName}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      commit('SET_SELECTED_ASSET', response.data.data);
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] } } };
      throw Validations.getErrorMessageFromCodeCustomer(axiosError.response?.data?.errors?.[0]);
    }
  },

  async [UPDATE_ASSET](
    { dispatch, commit }: Context, asset: Asset
  ): Promise<void> {
    try {
      const url = `http://127.0.0.1:8000/api/assets/${asset.id}`;
      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];

      const response = await axios.patch(url, asset, {
        headers: {
          Authorization: token,
        },
      });

      if ([200, 201].includes(response.status)) {
        // dispatch(LOAD_ASSET_DETAILS_BY_SUMMARY);
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