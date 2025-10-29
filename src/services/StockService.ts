import { StockApi } from "@/api/StockApi";
import { Stock, StockDetail, stockTableColumn } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";

export const StockService = {

    async create(itemId: number, stock: Stock): Promise<void> {
        try {
            await StockApi.create(itemId, stock);
        } catch(error) {
            throw errorHandler.pareseMItemError(error);
        }
    },

    async fetchData(): Promise<Stock[]> {
        try {
            const response = await StockApi.get();
            return response.data.data;    
        } catch(error) {
            throw errorHandler.pareseMItemError(error);
        }
    },

    async fetchDetailData(itemId: number): Promise<StockDetail[]> {
        try {
            const response = await StockApi.getDetail(itemId);
            return response.data.data;
        } catch(error) {
            throw errorHandler.pareseMItemError(error);
        }
    },

};