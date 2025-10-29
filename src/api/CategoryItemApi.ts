import { CategoryItem } from "@/types";
import AxiosInstance from "./AxiosInstance";

export const CategoryItemApi =  {
    create: (data: CategoryItem) => AxiosInstance.post('/categoryitems', data),
    update: (id:number, data: CategoryItem) => AxiosInstance.patch(`/categoryitems/${id}`, data),
    getAll: () => AxiosInstance.get('/categoryitems/all'),
    deactive: (id:number) => AxiosInstance.patch(`/categoryitems/inactive/${id}`)
}
