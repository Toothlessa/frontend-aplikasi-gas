import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import store from '../store/store';
import router from '@/router'; // Make sure this path matches your router file
import { GET_USER_TOKEN_GETTER, LOGOUT_ACTION } from "@/store/storeconstant";

const AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Accept': 'application/json',
    }
});

// ✅ Request interceptor — attach token
AxiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.getters[`auth/${GET_USER_TOKEN_GETTER}`];
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = token;
    }

    if(config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    } else {
        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

// ✅ Response interceptor — logout on token mismatch
AxiosInstance.interceptors.response.use(
    (response) => response, // Let successful responses pass through
    async (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Token invalid or expired. Logging out...");
            
            // 🔁 Dispatch logout action
            await store.dispatch(`auth/${LOGOUT_ACTION}`);

            // 🚪 Redirect to login page
            router.push({ name: 'login' }); // change 'login' to your actual login route name
        }

        // Always reject so components can also catch the error
        return Promise.reject(error);
    }
);

export default AxiosInstance;