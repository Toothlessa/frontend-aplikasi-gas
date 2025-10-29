import { CustomerAPI } from "@/api/CustomerApi";
import type { Customer  } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";

export const CustomerService = {

    async createOrUpdateCustomer(customer: Customer): Promise<void> {
        try {
        const response = customer.id
            ? await CustomerAPI.update(customer.id, customer)
            : await CustomerAPI.create(customer);
        } catch (error) {
            throw errorHandler.parseAxiosError(error);
        }
    },

    async fetchCustomers(): Promise<Customer[]> {
        try {
        const response = await CustomerAPI.getAll();
            // Transformasi data
            return response.data.data.map((item: Customer) => ({
                ...item,
                active_flag: item.active_flag === 'Y'
            }));
        } catch (error) {
            throw errorHandler.parseAxiosError(error);
        }
    },

    async uploadCustomer(file: File): Promise<void> {
        try {
            await CustomerAPI.upload(file);
        } catch (error) {
            throw errorHandler.parseUploadError(error);
        }
    },

    async deactiveCustomer(id:number): Promise<void> {
        try {
            await CustomerAPI.deactivate(id);

        } catch (error: any) {
            throw errorHandler.parseAxiosError(error);
        }
    },

};