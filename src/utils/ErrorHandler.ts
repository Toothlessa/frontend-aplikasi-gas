type ErrorMessageMapper = (message: string) => string;

export class errorHandler {

  /* ======================================================*
  * ERROR GENERAL                                         *
  * =======================================================*/
  // static parseError(
  //   error: unknown,
  //   mapMessage: ErrorMessageMapper,
  //   fallbackMessage: string,
  // ): string[] {
  //   const defaultFallback = fallbackMessage ?? "Unknown Error";
  //   const axiosError = error as {
  //     response?: {
  //       data?: {
  //         errors?: Record<string, string[]>;
  //         message?: string;
  //       };
  //     };
  //   };

  //   const errors = axiosError.response?.data?.errors;
  //   if (errors) {
  //     if (typeof errors === 'string') {
  //       return [mapMessage(errors)];
  //     }

  //     return Object.values(errors)
  //       .filter(Array.isArray)
  //       .map(messages => mapMessage(messages[0]));
  //   }

  //   const message = axiosError.response?.data?.message;
  //   if (message) {
  //     return [mapMessage(message)];
  //   }
    

  //   return [defaultFallback];
  // }
static parseError(
  error: unknown,
  mapMessage: ErrorMessageMapper,
  fallbackMessage?: string,
): string[] {
  const defaultFallback = fallbackMessage ?? "Unknown Error";

  const axiosError = error as {
    response?: {
      data?: {
        errors?: Record<string, string[]>;
        message?: string;
        error?: string; // 👈 TAMBAH INI
      };
    };
  };

  const data = axiosError.response?.data;

  // 1️⃣ validation errors
  if (data?.errors) {
    return Object.values(data.errors)
      .filter(Array.isArray)
      .map(messages => mapMessage(messages[0]));
  }

  // 2️⃣ single error code (CUSTOMER_NAME_EXISTS)
  if (typeof data?.error === "string") {
    return [mapMessage(data.error)];
  }

  // 3️⃣ generic message
  if (typeof data?.message === "string") {
    return [mapMessage(data.message)];
  }

  return [defaultFallback];
}


}
