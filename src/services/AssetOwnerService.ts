import { AssetOwnerApi } from "@/api/AssetOwnerApi";
import { Owner } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

export const AssetOwnerService = {
    async createOrUpdate(id: number, owner: Owner): Promise<void> {
        try {
            owner.id ? await AssetOwnerApi.update(id, owner)
                : await AssetOwnerApi.create(owner);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAssetOwner,
                'Unknow Error, Please Contact Support');
        }
    },

    async fetchData(): Promise<Owner> {
        try {
            const response = await AssetOwnerApi.fetchData();
            return response.data.data;
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAssetOwner,
                'Unknow Error, Please Contact Support');
        }
    },

    async deactive(id: number): Promise<void> {
        try {
            await AssetOwnerApi.deactive(id);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAssetOwner,
                'Unknow Error, Please Contact Support');
        }
    },


}