import { MasterItemApi } from "@/api/MasterItemApi";
import type { MasterItem } from "@/types"
import { errorHandler } from "@/utils/ErrorHandler";

export const MasterItemService = {
    
    async createOrUpdate(masteritem: MasterItem): Promise<void> {
        try {
            masteritem.id ? await MasterItemApi.update(masteritem.id, masteritem)
                          : await MasterItemApi.create(masteritem);

        } catch(error) {
          throw errorHandler.pareseMItemError(error);
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
        } catch(error) {
          throw errorHandler.pareseMItemError(error);
        }
    },

    async deactive(id: number): Promise<void> {
      try {

        await MasterItemApi.deactive(id);
      } catch (error) {
        throw errorHandler.pareseMItemError(error);
      }
    }


}