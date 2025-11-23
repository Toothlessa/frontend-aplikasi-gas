import { User } from "@/types";
import AxiosInstance from "./AxiosInstance";

export const UserApi = {
    updateUser: (data: User) => AxiosInstance.patch(`users/current`, data),
    fetchCurrentUser: () => AxiosInstance.get(`users/current`),
}