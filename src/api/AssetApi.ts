import { Asset } from "@/types";
import AxiosInstance from "./AxiosInstance";

export const AssetApi = {
    createAsset: (data: Asset) => AxiosInstance.post(`assets`, data),
    updateAsset: (id: number|string, data: Asset) => AxiosInstance.patch(`assets/${id}`, data),
    fetchAssetSummary: () => AxiosInstance.get('assets/summary'),
    fetchAssetDetailSummary: (ownerId: number, itemId:number) => AxiosInstance.get(`assets/details/${ownerId}/assets/${itemId}`),
}