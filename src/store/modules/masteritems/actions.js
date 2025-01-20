import AxiosInstance from "@/services/AxiosInstance";
import {
    CREATE_MASTERITEM_ACTION,
    GET_MASTERITEM_ACTION
} from "@/store/storeconstant";

export default {

    async [CREATE_MASTERITEM_ACTION](payload) {
        let postData = {
            item_name: payload.item_name,
            category: payload.category,
            cost_of_goods_sold: payload.cost_of_goods_sold,
            selling_price: payload.selling_price,
        }

        // let response = '';

        try {
            response = await AxiosInstance.post('http://127.0.0.1:8000/api/masteritems', postData);
        } catch (error) {
            let errorMessage = Validations.getErrorMessageFromCodeMasterItem(
                error.response.data.errors[0],
            );
            throw errorMessage;
        }
    },

    async [GET_MASTERITEM_ACTION]() {
        try {
            response = await AxiosInstance.get('http://127.0.0.1:8000/api/masteritems', postData);
        } catch (error) {
            throw error;
        }
    }
}