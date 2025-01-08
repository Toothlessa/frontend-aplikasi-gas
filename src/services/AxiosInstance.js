import axios from "axios";
import store from '../store/store'
import { GET_USER_TOKEN_GETTER } from "@/store/storeconstant";


const AxiosInstance = axios.create({});

AxiosInstance.interceptors.request.use((config) => {
    let params = new URLSearchParams();
    let token = store.getters[`${GET_USER_TOKEN_GETTER}`];
    params.append('auth', token);
    config.params = params;
    return config;
});
// const AxiosInstance = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api', // Ganti dengan URL backend Laravel Anda
//     headers: {
//         'Content-Type': 'application/json', // Pastikan tipe konten benar
//         'Accept': 'application/json',
//         //'Authorization': localStorage.getItem('token'),
//         }
//     });

     // Tambahkan token ke header Authorization
    //  AxiosInstance.interceptors.request.use((config) => {const token = localStorage.getItem('token');
    //     if (token) {
    //         config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    // },
    
    // (error) => Promise.reject(error));

export default AxiosInstance;
