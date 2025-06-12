// import AxiosInstance from '@/services/AxiosInstance';
import AxiosInstance from "axios";
import {
    GET_USER_TOKEN_GETTER,
    LOAD_CUSTOMER_DATA,
    SET_DATA_CUSTOMER,
    SET_LOADING,
    SET_ERROR,
} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';

export default {

    async [LOAD_CUSTOMER_DATA]({
        commit
    }) {
        commit(SET_LOADING, true);
        console.log("Start Loading Data");
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
        } catch (error) {
            commit(SET_ERROR, Validations.getErrorMessageFromCodeCustomer(error.response.data.errors[0]));
        } finally {
            commit(SET_LOADING, false);
        }
    }

}