import axios, { AxiosResponse } from 'axios';
import {
  CREATE_ASSET,
  CREATE_OWNER,
  DEACTIVE_OWNER,
  LOAD_ASSET,
  LOAD_OWNER,
  SET_DATA_ASSET,
  SET_DATA_OWNER,
  SET_HASSAVED,
  LOAD_ASSET_DETAILS_BY_SUMMARY,
  UPDATE_ASSET,
  SET_LOADING,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { ActionContext, ActionTree } from 'vuex';
import { RootState } from '@/store/types'; // ← create this file too
import { Asset, AssetState, Owner, RawAsset, RawOwner } from '@/types';
import AxiosInstance from '@/services/AxiosInstance';

type Context = ActionContext<AssetState,  RootState>;

const actions: ActionTree<AssetState, RootState> = {

  async [LOAD_ASSET]({ commit }: Context): Promise<void> {
    commit(SET_LOADING, true);
    try {
      const response: AxiosResponse<{ data: RawAsset[] }> = await AxiosInstance.get('assets/summary');

      const data: Asset[] = response.data.data;
      commit(SET_DATA_ASSET, data);
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] } } };
      throw Validations.getErrorMessageFromCodeCustomer(axiosError.response?.data?.errors?.[0]);
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [LOAD_OWNER]({ commit }: Context): Promise<void> {
    commit(SET_LOADING, true);
    try {
      
      const response: AxiosResponse<{ data: RawOwner[] }> = await AxiosInstance.get('assetowners/all');

      const data: Owner[] = response.data.data.map((owner) => ({
        ...owner,
        active_flag: owner.active_flag === 'Y',
      }));

      commit(SET_DATA_OWNER, data);
    } catch (error) {
      const axiosError = error as { response?: { data?: { errors?: string[] } } };
      throw Validations.getErrorMessageFromCodeCustomer(axiosError.response?.data?.errors?.[0]);
    } finally {
       commit(SET_LOADING, false);
    }
  },

  async [CREATE_OWNER](
    { dispatch, commit }: Context, owner: Owner
  ): Promise<void> {
    commit(SET_LOADING, true);
    try {
      
      const url = owner.id
        ? `assetowners/${owner.id}`
        : 'assetowners';

      const method: 'patch' | 'post' = owner.id ? 'patch' : 'post';

      const response: AxiosResponse<{ data: RawOwner[] }> = await AxiosInstance[method](url, owner);

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
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [CREATE_ASSET](
    { dispatch, commit }: Context, asset: Asset
  ): Promise<void> {
    try {
      const url = asset.id
        ? `assets/${asset.id}`
        : 'assets';

      const method: 'put' | 'post' = asset.id ? 'put' : 'post';

      const response: AxiosResponse<{ data: RawAsset[] }> = await AxiosInstance[method](url, asset);

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
    commit(SET_LOADING, true);
    try {
      const response: AxiosResponse<{ data: RawOwner[] }> = await AxiosInstance.patch(`assetowners/inactive/${id}`);
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
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [LOAD_ASSET_DETAILS_BY_SUMMARY](
    { commit }: Context, { ownerId, assetName }: { ownerId: string; assetName: string }
  ): Promise<void> {
    try {

      const response: AxiosResponse<{ data: RawAsset[] }> = await AxiosInstance.get(`assets/details/${ownerId}/assets/${assetName}`);

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
      const response: AxiosResponse<{ data: RawAsset[] }> = await AxiosInstance.patch(`assets/${asset.id}`, asset);

      if ([201].includes(response.status)) {
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