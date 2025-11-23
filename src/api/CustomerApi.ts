import AxiosInstance from './AxiosInstance';
import { Customer } from '@/types/Customer';

export const CustomerAPI = {
    create: (data: Customer) => AxiosInstance.post('/customers', data),
    update: (id: number, data: Customer) => AxiosInstance.put(`/customers/${id}`, data),
    getAll: () => AxiosInstance.get('/customers/all'),
    deactivate: (id: number) => AxiosInstance.patch(`/customers/inactive/${id}`),
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('csvFile', file);
        return AxiosInstance.post('/customers/import-csv', formData);
    },
    //
    fetchDataTop10Customer: () => AxiosInstance.get(`transactions/topcustomer`),
};
