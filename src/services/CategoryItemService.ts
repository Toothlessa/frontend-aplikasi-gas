import { CategoryItemApi } from "@/api/CategoryItemApi";
import { CategoryItem } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "./Validations";

export const CategoryItemService = {

    async createOrUpdate(categoryItem: CategoryItem): Promise<void> {
        try{ 
             categoryItem.id  ? await CategoryItemApi.update(categoryItem.id, categoryItem)
                              : await CategoryItemApi.create(categoryItem);
        } catch(error){
            throw errorHandler.pareseCategoryItemError(error);
        }
    },

    async fetchData(): Promise<void> {
        try {
            const response = await CategoryItemApi.getAll();
            return response.data.data.map((item: CategoryItem) => ({
                ...item,
                active_flag: item.active_flag == 'Y',
            }));
        } catch(error) {
             throw errorHandler.pareseCategoryItemError(error);
            // const axiosError = error as { response?: { data?: { errors?: string[] } } };
            // throw Validations.getErrorMessageFromCodeMasterItem(axiosError.response?.data?.errors?.[0]);
        }
    },

    async deactive(id: number): Promise<void> {
        try {
            await CategoryItemApi.deactive(id);

        } catch (error) {
            throw errorHandler.pareseCategoryItemError(error);
        }
    }
}