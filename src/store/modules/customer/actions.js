// import AxiosInstance from '@/services/AxiosInstance';
import AxiosInstance from "axios";
import {
    GET_USER_TOKEN_GETTER,
    CREATE_CUSTOMER,
    LOAD_CUSTOMER_DATA,
    SET_DATA_CUSTOMER,
    SET_LOADING,
    SET_ERROR,
    SET_HASSAVED,
    DEACTIVATE_CUSTOMER,
    UPLOAD_CUSTOMER,
    SET_SUCCESS_MESSAGE,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';

export default {

    async [LOAD_CUSTOMER_DATA]({
        commit
    }) {
        commit(SET_LOADING, true);
        try {
            const response = await AxiosInstance.get('http://127.0.0.1:8000/api/customers/all', {
                headers: {
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                },
            });
            const data = response.data.data.map((item) => ({
                ...item,
                active_flag: item.active_flag === 'Y',
            }));
            commit(SET_DATA_CUSTOMER, data);
            console.log("Data loaded successfully:", data);
        } catch (error) {
            commit(SET_ERROR, Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0]));
            throw error;
        } finally {
            commit(SET_LOADING, false);
        }
    },

     async [CREATE_CUSTOMER]({ dispatch, commit }, customer) {
      try {
        const url = customer.id
          ? `http://127.0.0.1:8000/api/customers/${customer.id}`
          : 'http://127.0.0.1:8000/api/customers';
        const method = customer.id ? 'put' : 'post';
        const response = await AxiosInstance[method](url, customer, {
          headers: {
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
          },
        });

        if ([200, 201].includes(response.status)) {
            dispatch(LOAD_CUSTOMER_DATA);
            commit(SET_HASSAVED, true);
            setTimeout(() => {
                commit(SET_HASSAVED, false);
            }, 2000); // 2 seconds
        }
      } catch (error) {
        const errors = error.response?.data?.errors;
        if (errors) {
          const messages = [];

          for (const field in errors) {
            if (Array.isArray(errors[field])) {
              const message = errors[field][0]; // first message per field
              messages.push(Validations.getErrorMessageFromCodeCustomer(message));
            }
          }
          throw messages; // throw array of messages
        }
      }
    },

    async [DEACTIVATE_CUSTOMER]({ dispatch, commit }, id) {
      try {
        await AxiosInstance.patch(`http://127.0.0.1:8000/api/customers/inactive/${id}`, null, {
          headers: {
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
          },
        });
        dispatch(LOAD_CUSTOMER_DATA);
        commit(SET_HASSAVED, true);
        setTimeout(() => {
                commit(SET_HASSAVED, false);
            }, 2000); // 2 seconds
      } catch (error) {
        throw Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0]);
      }
    },

    async [UPLOAD_CUSTOMER]({ dispatch, commit }, file) {
      const formData = new FormData();
      formData.append('csvFile', file);
      try {
        const response = await AxiosInstance.post(
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

          commit(SET_SUCCESS_MESSAGE, response.data.message);
          //console.log("Success: ", response.data.message);
          dispatch(LOAD_CUSTOMER_DATA);
          
          commit(SET_HASSAVED, true);
          setTimeout(() => {
            commit(SET_HASSAVED, false);
          }, 2000); // 2 seconds
        }
      } catch (error) {
        //console.log("Error Actions: ", error.response?.data?.message);
        const errorMessage = error.response?.data?.message; 
        const messages = [];
         
        if (errorMessage.includes("Duplicate entry")) {
          const fieldMatch = errorMessage.match(/for key '(.+?)'/);
          const fieldKey = fieldMatch ? fieldMatch[1] : null;    

          const fieldMap = {
            'customer_nik_unique': 'NIK',
            'customers_email_unique': 'Email',
          };

          const userFriendlyField = fieldMap[fieldKey] || 'field';

          messages.push(`Data duplicate on ${userFriendlyField}.`);
          throw messages; // throw array of messages
        } else {
           throw Validations.getErrorMessageFromCodeCustomer(error.response?.data?.message);
        }
      }
    },

}