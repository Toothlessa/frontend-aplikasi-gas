import Validation from "./Validation";

export class errorHandler {
  static parseAxiosError(error: any): string[] {
    const axiosError = error as {
      response?: {
        data?: {
          errors?: { [key: string]: string[] };
          error?: string;
          message?: string;
        };
      };
    };

    // Jika backend kirim errors: { field: [message] }
    const errors = axiosError.response?.data?.errors;
    if (errors) {
      const messages: string[] = [];
      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          const message = errors[field][0];
          messages.push(Validation.getErrorMessageFromCodeCustomer(message));
        }
      }
      return messages;
    }

    // Jika backend kirim message langsung
    const message = axiosError.response?.data?.message;
    if (message) {
      return [Validation.getErrorMessageFromCodeCustomer(message)];
    }

    // Fallback: pesan umum
    return ["Terjadi kesalahan yang tidak diketahui."];
  }

  static parseUploadError(error: any): string[] {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const errorMessage: string = axiosError.response?.data?.message ?? "";

    if (errorMessage.includes("Duplicate entry")) {
      const fieldMatch = errorMessage.match(/for key '(.+?)'/);
      const fieldKey = fieldMatch ? fieldMatch[1] : null;

      const fieldMap: Record<string, string> = {
        customer_nik_unique: "NIK",
        customers_email_unique: "Email",
      };

      const userFriendlyField = fieldKey ? fieldMap[fieldKey] || "field" : "field";
      return [`Data duplicate on ${userFriendlyField}.`];
    }

    return [Validation.getErrorMessageFromCodeCustomer(errorMessage)];
  }

  static pareseMItemError(error: any): string[] {
    const axiosError = error as {
      response?: {
        data?: {
          errors?: { [key: string]: string[] };
          error?: string;
          message?: string;
        };
      };
    };

    // Jika backend kirim errors: { field: [message] }
    const errors = axiosError.response?.data?.errors;
    if (errors) {
      const messages: string[] = [];
      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          const message = errors[field][0];
          messages.push(Validation.getErrorMessageFromCodeMasterItem(message));
        }
      }
      return messages;
    }

    // Jika backend kirim message langsung
    const message = axiosError.response?.data?.message;
    if (message) {
      return [Validation.getErrorMessageFromCodeCustomer(message)];
    }

    // Fallback: pesan umum
    return ["Terjadi kesalahan yang tidak diketahui."];
  }

  static pareseCategoryItemError(error: any): string[] {
    const axiosError = error as {
      response?: {
        data?: {
          errors?: { [key: string]: string[] };
          error?: string;
          message?: string;
        };
      };
    };

    // Jika backend kirim errors: { field: [message] }
    const errors = axiosError.response?.data?.errors;
    if (errors) {
      const messages: string[] = [];
      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          const message = errors[field][0];
          messages.push(Validation.getErrorMessageFromCodeCategoryItem(message));
        }
      }
      return messages;
    }

    // Jika backend kirim message langsung
    const message = axiosError.response?.data?.message;
    if (message) {
      return [Validation.getErrorMessageFromCodeCategoryItem(message)];
    }
    // Fallback: pesan umum
    return ["Terjadi kesalahan yang tidak diketahui."];
  }

  /* ======================================================*
   * ERROR ASSET                                           *
   * ======================================================*/
  static parseAssetError(error: any): string[] {
    const axiosError = error as {
      response?: {
        data?: {
          errors?: { [key: string]: string[] };
          error?: string;
          message?: string;
        };
      };
    };

    // Jika backend kirim errors: { field: [message] }
    const errors = axiosError.response?.data?.errors;
    if (errors) {
      const messages: string[] = [];
      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          const message = errors[field][0];
          messages.push(Validation.getErrorMessageCodeFromAsset(message));
        }
      }
      return messages;
    }

    // Jika backend kirim message langsung
    const message = axiosError.response?.data?.message;
    if (message) {
      return [Validation.getErrorMessageCodeFromAsset(message)];
    }

    // Fallback: pesan umum
    return ["Terjadi kesalahan yang tidak diketahui."];
  }

  /* ======================================================*
   * ERROR ASSET OWNER                                       *
   * ======================================================*/
  static parseAssetOwnerError(error: any): string[] {
    const axiosError = error as {
      response?: {
        data?: {
          errors?: { [key: string]: string[] };
          error?: string;
          message?: string;
        };
      };
    };

    const errors = axiosError.response?.data?.errors;
    if (errors) {
      const messages: string[] = [];
      for (const field in errors) {
        if (Array.isArray(errors[field])) {
          const message = errors[field][0];
          messages.push(Validation.getErrorMessageCodeFromAssetOwner(message));
        }
      }
      return messages;
    }

    return ["Unknow Error, Please Contact Support"];
  }

}
