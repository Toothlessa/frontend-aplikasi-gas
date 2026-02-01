import { AssetApi } from "@/api/AssetApi";
import { Asset } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const AssetService = {

    async createOrUpdateAsset(asset: Asset): Promise<void> {
        try {
            asset.id
                ? await AssetApi.updateAsset(asset.id, asset)
                : await AssetApi.createAsset(asset);
        } catch (e) {
            throw errorHandler.parseError(e,
                Validations.getErrorMessageCodeFromAsset,
                FALLBACK_MESSAGE);
        }
    },

    async fetchAssetSummary(): Promise<Asset[]> {
        try {
            const response = await AssetApi.fetchAssetSummary();
            return response.data.data;
        } catch (error) {
            throw errorHandler.parseError(error,
                Validations.getErrorMessageCodeFromAsset,
                FALLBACK_MESSAGE);
        }
    },

    async fetchAssetDetailSummary(ownerId: number, itemId: number): Promise<void> {
        try {
            const response = await AssetApi.fetchAssetDetailSummary(ownerId, itemId);
            return response.data.data;
        } catch (error) {
            throw errorHandler.parseError(error,
                Validations.getErrorMessageCodeFromAsset,
                FALLBACK_MESSAGE);
        }
    },

};