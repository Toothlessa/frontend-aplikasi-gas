import { MasterItem, RawMasterItem } from "@/types";
import AxiosInstance from "./AxiosInstance";

export const MasterItemApi = {
    create: (data: MasterItem) => AxiosInstance.post('/masteritems', data),
    update: (id:number, data:MasterItem) => AxiosInstance.put(`/masteritems/${id}`, data),
    getAll: () => AxiosInstance.get('/masteritems/all'),
    deactive: (id:number) => AxiosInstance.patch(`/masteritems/inactive/${id}`),
}