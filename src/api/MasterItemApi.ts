import { MasterItem, RawMasterItem } from "@/types";
import AxiosInstance from "./AxiosInstance";

export const MasterItemApi = {
    create: (data: MasterItem) => AxiosInstance.post('/masteritems', data),
    update: (id:number, data:MasterItem) => AxiosInstance.put(`/masteritems/${id}`, data),
    getAll: () => AxiosInstance.get('/masteritems/all'),
    fetchItemByType: (itemType: string) => AxiosInstance.get(`masteritems/itemtype/${itemType}`),
    deactive: (id:number) => AxiosInstance.patch(`/masteritems/inactive/${id}`),
}