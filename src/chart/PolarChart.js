import AxiosInstance from "@/services/AxiosInstance";
import store from "@/store/store";
import {
    GET_USER_TOKEN_GETTER
} from "@/store/storeconstant";

let response =
    await AxiosInstance
    .get(`http://127.0.0.1:8000/api/transactions/topcustomer`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
        }
    });
let customers = [];
let totals = [];

for (let i = 0; i < response.data.length; i++) {
    customers.push(response.data[i].customer_name);
    totals.push(response.data[i].total);
}

export const data = {
    labels: customers,
    datasets: [{
            label: 'Total Penjualan',
            backgroundColor: 'rgba(46,191,175,0.2)',
            pointBackgroundColor: '#2EBFAF',
            pointBorderColor: '#2EBFAF',
            pointHoverBackgroundColor: '#2EBFAF',
            pointHoverBorderColor: '#2EBFAF',
            data: totals
        },

    ]
}

export const options = {
    responsive: true,
    maintainAspectRatio: false
}