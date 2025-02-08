import AxiosInstance from "@/services/AxiosInstance"
import store from "@/store/store";
import {
    GET_USER_TOKEN_GETTER
} from "@/store/storeconstant";

let response =
    await AxiosInstance
    .get(`http://127.0.0.1:8000/api/transactions/salesperweek`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        }
    });
let days = [];
let month = null || new Date().toLocaleString('default', {
    month: 'long'
});
let totals = [];

for (let i = 0; i < response.data.length; i++) {
    days.push(response.data[i].day);
    totals.push(response.data[i].total);
}

if (response.length) {
    month = response.data[0].month;
}

export const data = {
    labels: days,
    datasets: [{
        label: month,
        backgroundColor: '#2EBFAF',
        data: totals,
    }],
}

export const options = {
    responsive: true,
    maintainAspectRatio: false
}