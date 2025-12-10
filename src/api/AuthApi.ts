import { AuthUser } from "@/types/Auth";
import AxiosInstance from "./AxiosInstance";

export const AuthApi = {
    login: (data: AuthUser) => AxiosInstance.post(`users/login`, data),
    register: (data: AuthUser) => AxiosInstance.post(`users`, data),
    logout: () => AxiosInstance.delete(`users/logout`),
};