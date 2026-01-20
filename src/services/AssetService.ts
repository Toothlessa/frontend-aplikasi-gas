import { AssetApi } from "@/api/AssetApi";
import { Asset } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

export const AssetService = {

    async createOrUpdateAsset(asset: Asset): Promise<void> {
        try {
            asset.id
                ? await AssetApi.updateAsset(asset.id, asset)
                : await AssetApi.createAsset(asset);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAsset,
                "Unknow Error, Please Contact Support");
        }
    },

    async fetchAssetSummary(): Promise<Asset[]> {
        try {
            const response = await AssetApi.fetchAssetSummary();
            return response.data.data;
        } catch (error) {
            throw errorHandler.parseError(error,
                Validations.getErrorMessageCodeFromAsset,
                "Unknow Error, Please Contact Support");
        }
    },

    async fetchAssetDetailSummary(ownerId: number, itemId: number): Promise<void> {
        try {
            const response = await AssetApi.fetchAssetDetailSummary(ownerId, itemId);
            return response.data.data;
        } catch (error) {
            throw errorHandler.parseError(error,
                Validations.getErrorMessageCodeFromAsset,
                "Unknow Error, Please Contact Support");
        }
    },

};