import { errorHandler } from "@/utils/ErrorHandler";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useStore } from "vuex";

export function useGlobal() {

    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const theme = useTheme();
    const search = ref("");

    /* -----------------------------------------------------*
     * FORMATTERS & UTILITIES                               *
     * ---------------------------------------------------- */
    const formatPrice = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(value);

    /* -----------------------------------------------------*
    * VALIDATION ERROR HELPERS                              *
    * ----------------------------------------------------  */
    const validationErrorMessages = ref<string[]>([]);
    const validationShowError = ref(false);

    const validationError = (
        error: unknown,
        mapMessage?: (message: string) => string,
        fallback?: string,
    ) => {
        const defaultFallback = fallback ?? "Unknown Error";
        validationShowError.value = true;

        if (Array.isArray(error)) {
            validationErrorMessages.value = error;
            return;
        }
        if (mapMessage) {
            validationErrorMessages.value = errorHandler.parseError(
                error,
                mapMessage,
                defaultFallback
            );
            return;
        }
        if (error instanceof Error) {
            validationErrorMessages.value = [error.message];
            return;
        }
        validationErrorMessages.value = [String(error)];
    };

    return {
        //vue component
        store,
        router,
        route,
        theme,

        //global component
        search,

        //global ultilities
        formatPrice,

        //validation helpers
        validationErrorMessages,
        validationShowError,
        validationError
    }
}