import { CustomerAPI } from "@/api/CustomerApi";
import type { Customer, TopCustomerTransaction } from "@/types";
import { errorHandler } from "@/utils/ErrorHandler";
import Validations from "@/utils/Validation";

const FALLBACK_MESSAGE = "unknown error, please contact your support";

export const CustomerService = {

  async createOrUpdateCustomer(customer: Customer): Promise<void> {
    try {
      customer.id
        ? await CustomerAPI.update(customer.id, customer)
        : await CustomerAPI.create(customer);
    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageFromCodeCustomer,
        FALLBACK_MESSAGE
      );
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
    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageFromCodeCustomer,
        FALLBACK_MESSAGE
      );
    }
  },

  async uploadCustomer(file: File): Promise<void> {
    try {
      await CustomerAPI.upload(file);
    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageFromCodeCustomer,
        FALLBACK_MESSAGE
      );
    }
  },

  async deactiveCustomer(id: number): Promise<void> {
    try {
      await CustomerAPI.deactivate(id);

    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageFromCodeCustomer,
        FALLBACK_MESSAGE
      );
    }
  },

  async fetchDataTopCustomer(): Promise<TopCustomerTransaction[]> {
    try {
      const response = await CustomerAPI.fetchDataTop10Customer();
      return response.data;
    } catch (e) {
      throw errorHandler.parseError(e,
        Validations.getErrorMessageFromCodeCustomer,
        FALLBACK_MESSAGE
      );
    }
  },

};
