import axios from 'axios';
import {
  CREATE_CUSTOMER,
  DEACTIVATE_CUSTOMER,
  GET_USER_TOKEN_GETTER,
  LOAD_CUSTOMER_DATA,
  SET_DATA_CUSTOMER,
  SET_HASSAVED,
  SET_LOADING,
  UPLOAD_CUSTOMER
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { ActionContext, ActionTree } from 'vuex';
import { CustomerState, Customer } from '@/types/Customer';
import { RootState } from '@/store/types'; // ← create this file too

type Context = ActionContext<CustomerState,  RootState>;

const actions: ActionTree<CustomerState, RootState> = {
  async [LOAD_CUSTOMER_DATA]({ commit }: Context): Promise<void> {
    commit(SET_LOADING, true);
    try {

      const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
      const response = await axios.get('http://127.0.0.1:8000/api/customers/all', {
        headers: {
          Authorization: token,
        },
      });

      const data: Customer[] = response.data.data.map((item: any) => ({
        ...item,
        active_flag: item.active_flag === 'Y',
        in_stock: item.in_stock === 'Y',
      }));

      commit(SET_DATA_CUSTOMER, data);
    } catch (error: any) {
      throw Validations.getErrorMessageFromCodeCustomer(error.response?.data?.errors?.[0]);
    } finally {
      commit(SET_LOADING, false);
    }
  },

  async [CREATE_CUSTOMER](
    { dispatch, commit }: Context, customer: Customer
  ): Promise<void> {
    try {
      const url = customer.id
        ? `http://127.0.0.1:8000/api/customers/${customer.id}`
        : 'http://127.0.0.1:8000/api/customers';

      const method: 'put' | 'post' = customer.id ? 'put' : 'post';

      const response = await axios[method](url, customer, {
        headers: {
          Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });

      if ([200, 201].includes(response.status)) {
        dispatch(LOAD_CUSTOMER_DATA);
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

  async [DEACTIVATE_CUSTOMER](
    { dispatch, commit }: Context, id
  ): Promise<void> {
    try {
      const url = `http://127.0.0.1:8000/api/customers/inactive/${id}`;

      const response = await axios.patch(url, [], {
        headers: {
          Authorization: store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        },
      });

      if ([200].includes(response.status)) {
        dispatch(LOAD_CUSTOMER_DATA);
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

  async [UPLOAD_CUSTOMER](
    { dispatch, commit }: ActionContext<CustomerState, RootState>,
    file: File
  ): Promise<void> {
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/customers/import-csv',
        formData,
        {
          headers: {
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        dispatch(LOAD_CUSTOMER_DATA);

        commit(SET_HASSAVED, true);
        setTimeout(() => {
          commit(SET_HASSAVED, false);
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage: string = error.response?.data?.message ?? '';

      if (errorMessage.includes("Duplicate entry")) {
        const fieldMatch = errorMessage.match(/for key '(.+?)'/);
        const fieldKey = fieldMatch ? fieldMatch[1] : null;

        const fieldMap: Record<string, string> = {
          'customer_nik_unique': 'NIK',
          'customers_email_unique': 'Email',
        };

        const userFriendlyField = fieldKey ? fieldMap[fieldKey] || 'field' : 'field';
        throw [`Data duplicate on ${userFriendlyField}.`];
      } else {
        throw Validations.getErrorMessageFromCodeCustomer(errorMessage);
      }
    }
  }

};

export default actions;

// export default {

//     async [LOAD_CUSTOMER_DATA]({
//         commit
//     }) {
//         commit(SET_LOADING, true);
//         try {
//             const response = await AxiosInstance.get('http://127.0.0.1:8000/api/customers/all', {
//                 headers: {
//                     'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
//                 },
//             });
//             const data = response.data.data.map((item) => ({
//                 ...item,
//                 active_flag: item.active_flag === 'Y',
//             }));
//             commit(SET_DATA_CUSTOMER, data);
//             console.log("Data loaded successfully:", data);
//         } catch (error) {
//             commit(SET_ERROR, Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0]));
//             throw error;
//         } finally {
//             commit(SET_LOADING, false);
//         }
//     },

//      async [CREATE_CUSTOMER]({ dispatch, commit }, customer) {
//       try {
//         const url = customer.id
//           ? `http://127.0.0.1:8000/api/customers/${customer.id}`
//           : 'http://127.0.0.1:8000/api/customers';
//         const method = customer.id ? 'put' : 'post';
//         const response = await AxiosInstance[method](url, customer, {
//           headers: {
//             'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
//           },
//         });

//         if ([200, 201].includes(response.status)) {
//             dispatch(LOAD_CUSTOMER_DATA);
//             commit(SET_HASSAVED, true);
//             setTimeout(() => {
//                 commit(SET_HASSAVED, false);
//             }, 2000); // 2 seconds
//         }
//       } catch (error) {
//         const errors = error.response?.data?.errors;
//         if (errors) {
//           const messages = [];

//           for (const field in errors) {
//             if (Array.isArray(errors[field])) {
//               const message = errors[field][0]; // first message per field
//               messages.push(Validations.getErrorMessageFromCodeCustomer(message));
//             }
//           }
//           throw messages; // throw array of messages
//         }
//       }
//     },

//     async [DEACTIVATE_CUSTOMER]({ dispatch, commit }, id) {
//       try {
//         await AxiosInstance.patch(`http://127.0.0.1:8000/api/customers/inactive/${id}`, null, {
//           headers: {
//             'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
//           },
//         });
//         dispatch(LOAD_CUSTOMER_DATA);
//         commit(SET_HASSAVED, true);
//         setTimeout(() => {
//                 commit(SET_HASSAVED, false);
//             }, 2000); // 2 seconds
//       } catch (error) {
//         throw Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0]);
//       }
//     },

//     async [UPLOAD_CUSTOMER]({ dispatch, commit }, file) {
//       const formData = new FormData();
//       formData.append('csvFile', file);
//       try {
//         const response = await AxiosInstance.post(
//           'http://127.0.0.1:8000/api/customers/import-csv',
//           formData,
//           {
//             headers: {
//               'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );
//         if (response.status === 200) {

//           commit(SET_SUCCESS_MESSAGE, response.data.message);
//           //console.log("Success: ", response.data.message);
//           dispatch(LOAD_CUSTOMER_DATA);
          
//           commit(SET_HASSAVED, true);
//           setTimeout(() => {
//             commit(SET_HASSAVED, false);
//           }, 2000); // 2 seconds
//         }
//       } catch (error) {
//         //console.log("Error Actions: ", error.response?.data?.message);
//         const errorMessage = error.response?.data?.message; 
//         const messages = [];
         
//         if (errorMessage.includes("Duplicate entry")) {
//           const fieldMatch = errorMessage.match(/for key '(.+?)'/);
//           const fieldKey = fieldMatch ? fieldMatch[1] : null;    

//           const fieldMap = {
//             'customer_nik_unique': 'NIK',
//             'customers_email_unique': 'Email',
//           };

//           const userFriendlyField = fieldMap[fieldKey] || 'field';

//           messages.push(`Data duplicate on ${userFriendlyField}.`);
//           throw messages; // throw array of messages
//         } else {
//            throw Validations.getErrorMessageFromCodeCustomer(error.response?.data?.message);
//         }
//       }
//     },

