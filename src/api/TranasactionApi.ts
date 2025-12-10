import { Transaction } from "@/types/Transaction";
import AxiosInstance from "./AxiosInstance";

export const TransactionApi = {
    createTransaction: (data: Transaction) => AxiosInstance.post(`/transactions`, data),
    updateTransaction: (id: number, data: Transaction) => AxiosInstance.patch(`transactions/${id}`, data),
    fetchTransactionByDate: (date: Date) => AxiosInstance.get(`transactions/date/${date}`), 
    //
    fetchOutstandingTransaction: () => AxiosInstance.get(`transactions/outstanding`),
    fetchLast30DaysSale: () => AxiosInstance.get(`transactions/dailysale`),

};