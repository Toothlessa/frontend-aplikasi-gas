import { Owner } from "@/types";
import AxiosInstance from "./AxiosInstance";

export const AssetOwnerApi = {
    create: (data: Owner) => AxiosInstance.post(`assetowners`, data),
    update: (id: number, data: Owner) => AxiosInstance.patch(`assetowners/${id}`, data),
    fetchData: () => AxiosInstance.get('assetowners/all'),
    deactive: (id:number) => AxiosInstance.patch(`assetowners/inactive/${id}`),
}