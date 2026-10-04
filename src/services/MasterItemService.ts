import { MasterItemApi } from "@/api/MasterItemApi";
import type { MasterItem } from "@/types"
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const MasterItemService = {

  async createOrUpdate(masteritem: MasterItem): Promise<void> {
    try {
      masteritem.id ? await MasterItemApi.update(masteritem.id, masteritem)
        : await MasterItemApi.create(masteritem);

    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageCodeFromMasterItem,
        FALLBACK_MESSAGE
      );
    }
  },

  async fetchData(): Promise<MasterItem[]> {
    try {

      const response = await MasterItemApi.getAll();
      return response.data.data.map((item: MasterItem) => ({
        ...item,
        active_flag: item.active_flag == 'Y',
        in_stock: item.in_stock === 'Y',
      }));
    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageCodeFromMasterItem,
        FALLBACK_MESSAGE
      );
    }
  },

  async fetchItemByType(itemType: string): Promise<MasterItem[]> {
    try {
      const response = await MasterItemApi.fetchItemByType(itemType);
      return response.data.data.map((item: MasterItem) => ({
        ...item,
        active_flag: item.active_flag == 'Y',
        in_stock: item.in_stock === 'Y',
      }));
    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageCodeFromMasterItem,
        FALLBACK_MESSAGE
      );
    }
  },

  async fetchItemGasIsi(): Promise<MasterItem[]> {
    try {
      const response = await MasterItemApi.getMItemGasIsi();
      const rawData = response.data?.data;

      if (!rawData) return [];

      const rawItems: MasterItem[] = Array.isArray(rawData) ? rawData : [rawData];

      return rawItems.map((item: MasterItem) => ({
        ...item,
        id: Number(item.id),
        active_flag: item.active_flag === 'Y',
        in_stock: item.in_stock === 'Y',
      }));
    } catch (e) {
      console.error('Error detail di Service:', e);
      throw errorHandler.parseError(e,
        Validations.getErrorMessageCodeFromMasterItem,
        FALLBACK_MESSAGE
      );
    }
  },

  async deactive(id: number): Promise<void> {
    try {

      await MasterItemApi.deactive(id);
    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageCodeFromMasterItem,
        FALLBACK_MESSAGE
      );
    }
  }


}
