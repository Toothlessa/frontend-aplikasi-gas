import { CategoryItemApi } from "@/api/CategoryItemApi";
import { CategoryItem } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const CategoryItemService = {

    async createOrUpdate(categoryItem: CategoryItem): Promise<void> {
        try {
            categoryItem.id ? await CategoryItemApi.update(categoryItem.id, categoryItem)
                : await CategoryItemApi.create(categoryItem);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageFromCodeMasterItem,
                FALLBACK_MESSAGE);
        }
    },

    async fetchData(): Promise<void> {
        try {
            const response = await CategoryItemApi.getAll();
            return response.data.data.map((item: CategoryItem) => ({
                ...item,
                active_flag: item.active_flag == 'Y',
            }));
        } catch (error) {
            throw errorHandler.parseError(error,
                Validations.getErrorMessageFromCodeMasterItem,
                FALLBACK_MESSAGE);
        }
    },

    async deactive(id: number): Promise<void> {
        try {
            await CategoryItemApi.deactive(id);

        } catch (error) {
            throw errorHandler.parseError(error,
                Validations.getErrorMessageFromCodeMasterItem,
                FALLBACK_MESSAGE);
        }
    }
}