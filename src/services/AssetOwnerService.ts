import { AssetOwnerApi } from "@/api/AssetOwnerApi";
import { Owner } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const AssetOwnerService = {
    async createOrUpdate(id: number, owner: Owner): Promise<void> {
        try {
            owner.id ? await AssetOwnerApi.update(id, owner)
                : await AssetOwnerApi.create(owner);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAssetOwner,
                FALLBACK_MESSAGE);
        }
    },

    async fetchData(): Promise<Owner> {
        try {
            const response = await AssetOwnerApi.fetchData();
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAssetOwner,
                FALLBACK_MESSAGE);
        }
    },

    async deactive(id: number): Promise<void> {
        try {
            await AssetOwnerApi.deactive(id);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAssetOwner,
                FALLBACK_MESSAGE);
        }
    },


}