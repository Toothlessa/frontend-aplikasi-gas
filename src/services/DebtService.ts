import { DebtApi } from "@/api/DebtApi";
import { Debt, SummaryDebt } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";

export const DebtService = {

    async createDebt(debt: Debt): Promise<void> {
        try{
            await DebtApi.createDebt(debt);
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async updateDebt(id:number, debt: Debt): Promise<void>{
        try{
            await DebtApi.updateDebt(id, debt);
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async fetchDetailDebtData(customerId: number): Promise<Debt[]>{
        try{
            const response = await DebtApi.fetchDetailDebt(customerId);
            return response.data.data;
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async fetchSummaryDebtData(): Promise<SummaryDebt[]>{
        try{
            const response = await DebtApi.fetchSummaryDebt();
            return response.data.data;
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },
}