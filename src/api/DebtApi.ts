import { Debt } from "@/types";
import AxiosInstance from "./AxiosInstance";

export const DebtApi = {
    createDebt: (data: Debt) => AxiosInstance.post(`debts`, data),
    updateDebt: (id: number, data: Debt) => AxiosInstance.patch(`/debts/${id}`, data),
    fetchDetailDebt: (customerId: number) => AxiosInstance.get(`debts/customer/${customerId}`),
    fetchSummaryDebt: () => AxiosInstance.get(`debts/summary`),
    fetchOutstandingDebt: () => AxiosInstance.get(`debts/outstanding`),
}