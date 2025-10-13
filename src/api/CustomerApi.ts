import AxiosInstance from './AxiosInstance';
import { Customer } from '@/types/Customer';

export const CustomerAPI = {
    create: (data: Customer) => AxiosInstance.post('/customers', data),
    update: (id: number, data: Customer) => AxiosInstance.put(`/customers/${id}`, data),
    getAll: () => AxiosInstance.get('/customers/all'),
    deactivate: (id: number) => AxiosInstance.patch(`/customers/inactive/${id}`),
    upload: () => AxiosInstance.post('/customers/import-csv')
};
