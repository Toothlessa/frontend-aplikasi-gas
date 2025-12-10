import { TransactionApi } from "@/api/TranasactionApi";
import { DailySale, Transaction } from "@/types/Transaction";
import { errorHandler } from "@/utils/ErrorHandler";

export const TransactionService = {
    async createOrUpdateTransaction(transaction: Transaction): Promise<void> {
        try{
            transaction.stock = -(transaction.quantity || 1)
            transaction.total =  (transaction.amount) * (transaction.quantity || 1);

            transaction.id 
                ? await TransactionApi.updateTransaction(transaction.id, transaction)
                : await TransactionApi.createTransaction(transaction);
        } catch (error) {
            throw errorHandler.parseAxiosError(error);
        }
    },

    async fetchTransactionByDate(date: Date): Promise<Transaction[]>{
        try {
            const response = await TransactionApi.fetchTransactionByDate(date);
            return response.data.data;
        } catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async fetchOutstandingTransaction(): Promise<Transaction[]>{
        try{
            const response  = await TransactionApi.fetchOutstandingTransaction();
            return response.data.data;
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },

    async fetchLast30DaysSale(): Promise<DailySale[]>{
        try{
            const response = await TransactionApi.fetchLast30DaysSale();
            return response.data.data;
        }catch(error){
            throw errorHandler.parseAxiosError(error);
        }
    },
};