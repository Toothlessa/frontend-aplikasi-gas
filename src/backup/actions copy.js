// import AxiosInstance from '@/services/AxiosInstance';
import AxiosInstance from "axios";
import {
    GET_USER_TOKEN_GETTER,
    LOAD_MASTER_ITEM,
    SET_DATA_MITEM,
    SET_LOADING,

} from '@/store/storeconstant';
import Validations from '@/services/Validations';
import store from '@/store/store';

export default {

    async [LOAD_MASTER_ITEM]({
        commit
    }) {
        commit(SET_LOADING, true);
        console.log("start loading data");
        try {
            const response = await AxiosInstance.get(`http://127.0.0.1:8000/api/masteritems/all`, {
                headers: {
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                },
            });
            const data = response.data.data.map((item) => ({
                ...item,
                active_flag: item.active_flag === 'Y',
            }));
            commit(SET_DATA_MITEM, data);
            console.log("Data loaded successfully:", data);
        } catch (error) {
            throw Validations.getErrorMessageFromCodeMasterItem(error.response.data.errors[0]);
        } finally {
            commit(SET_LOADING, false);
        }
    },
}