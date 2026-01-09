import { AssetOwnerApi } from "@/api/AssetOwnerApi";
import { Owner } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";

export const AssetOwnerService = {
    async createOrUpdate(id: number, owner: Owner): Promise<void> {
        try {
            owner.id ? await AssetOwnerApi.update(id, owner)
                : await AssetOwnerApi.create(owner);
        } catch (error) {
            throw errorHandler.parseAssetOwnerError(error);
        }
    },

    async fetchData(): Promise<Owner> {
        try {
            const response = await AssetOwnerApi.fetchData();
            return response.data.data;
        } catch (error) {
            throw errorHandler.parseAssetOwnerError(error);
        }
    },

    async deactive(id: number): Promise<void> {
        try {
            await AssetOwnerApi.deactive(id);
        } catch (error) {
            throw errorHandler.parseAssetOwnerError(error);
        }
    },


}