import AxiosInstance from "./AxiosInstance";
import { Stock } from "@/types";

export const StockApi = {
    create: (itemId: number, stock: number) => AxiosInstance.post(`stockitems/${itemId}`, stock),
    update: (id: number, data: Stock) => AxiosInstance.put(`stockitems/${id}`, data),
    get: () => AxiosInstance.get('stockitems/currentstock'),
    getDetail: (itemId: number) => AxiosInstance.get(`stockitems/detailstock/${itemId}`),
    fetchDataDisplayStock: (filledId: number, emptyId: number) => AxiosInstance.get(`stockitems/displaystock/${filledId}/${emptyId}`),
}