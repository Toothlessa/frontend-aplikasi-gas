import AxiosInstance from "./AxiosInstance";
import { Stock, UpdateStockPayload } from "@/types";

export const StockApi = {
    create: (itemId: number, stock: number) => AxiosInstance.post(`stockitems/${itemId}`, stock),
    update: (id: number, data: Stock | UpdateStockPayload) => AxiosInstance.put(`stockitems/${id}`, data),
    get: () => AxiosInstance.get('stockitems/current'),
    getDetail: (itemId: number) => AxiosInstance.get(`stockitems/detail/${itemId}`),
    fetchDataDisplayStock: (filledId: number, emptyId: number) => AxiosInstance.get(`stockitems/display/${filledId}/${emptyId}`),
}