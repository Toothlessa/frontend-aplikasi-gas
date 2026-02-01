import { StockApi } from "@/api/StockApi";
import { Stock, StockDetail, StockDisplay } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const StockService = {

    async create(itemId: number, stock: number): Promise<void> {
        try {
            await StockApi.create(itemId, stock);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromStock,
                FALLBACK_MESSAGE
            );
        }
    },

    async update(id: number, stock: Stock): Promise<void> {
        try {
            await StockApi.update(id, stock);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromStock,
                FALLBACK_MESSAGE
            );
        }
    },

    async fetchData(): Promise<Stock[]> {
        try {
            const response = await StockApi.get();
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromStock,
                FALLBACK_MESSAGE
            );
        }
    },

    async fetchDetailData(itemId: number): Promise<StockDetail[]> {
        try {
            const response = await StockApi.getDetail(itemId);
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromStock,
                FALLBACK_MESSAGE
            );
        }
    },

    async fetchDataDisplayStock(filledId: number, emptyId: number): Promise<StockDisplay[]> {
        try {
            const response = await StockApi.fetchDataDisplayStock(filledId, emptyId);
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromStock,
                FALLBACK_MESSAGE
            );
        }
    },

};