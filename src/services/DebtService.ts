import { DebtApi } from "@/api/DebtApi";
import { Debt, SummaryDebt } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const DebtService = {

    async createDebt(debt: Debt): Promise<void> {
        try {
            await DebtApi.createDebt(debt);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromDebt,
                FALLBACK_MESSAGE
            );
        }
    },

    async updateDebt(id: number, debt: Debt): Promise<void> {
        try {
            await DebtApi.updateDebt(id, debt);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromDebt,
                FALLBACK_MESSAGE
            );
        }
    },

    async fetchDetailDebtData(customerId: number): Promise<Debt[]> {
        try {
            const response = await DebtApi.fetchDetailDebt(customerId);
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromDebt,
                FALLBACK_MESSAGE
            );
        }
    },

    async fetchSummaryDebtData(): Promise<SummaryDebt[]> {
        try {
            const response = await DebtApi.fetchSummaryDebt();
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromDebt,
                FALLBACK_MESSAGE
            );
        }
    },

    async fetchOustandingDebt(): Promise<SummaryDebt[]> {
        try {
            const response = await DebtApi.fetchOutstandingDebt();
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromDebt,
                FALLBACK_MESSAGE
            );
        }
    }
}