import { TransactionApi } from "@/api/TranasactionApi";
import { Transaction } from "@/types/Transaction";
import { errorHandler } from "@/utils/ErrorHandler";

export const TransactionService = {
    async createOrUpdateTransaction(transaction: Transaction): Promise<void> {
        try{
            const response = transaction.id 
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
    }
};