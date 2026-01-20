import { errorHandler } from "@/utils/ErrorHandler";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useStore } from "vuex";

export function useGlobal() {

    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const theme = useTheme();

    const search = ref("");

    /* ----------------------------------------------------
     * FORMATTERS & UTILITIES
     * ---------------------------------------------------- */
    const formatPrice = (value: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(value);

    /* -----------------------------------------------------*
    * ERROR HELPERS                                         *
    * ----------------------------------------------------  */
    const alert = ref(false);
    const showError = ref(false);
    const error = ref<string | string[] | undefined>();
    const errorMessages = computed<string[]>(() =>
        error.value
            ? (Array.isArray(error.value) ? error.value : [error.value])
            : []
    );

    const handleError = (e: unknown) => {
        showError.value = true;

        if (Array.isArray(e)) error.value = e;
        else if (e instanceof Error) error.value = e.message;
        else error.value = String(e);
    };

    /* -----------------------------------------------------*
    * VALIDATION ERROR HELPERS                              *
    * ----------------------------------------------------  */
    const validationErrorMessages = ref<string[]>([]);
    const validationShowError = ref(false);

    const validationError = (
        error: unknown,
        mapMessage?: (message: string) => string,
        fallback = "Unknow Error, Please Contact Support."
    ) => {
        validationShowError.value = true;

        // Sudah array → langsung pakai
        if (Array.isArray(error)) {
            validationErrorMessages.value = error;
            return;
        }

        // Ada mapper → pakai Validation parser
        if (mapMessage) {
            validationErrorMessages.value = errorHandler.parseError(
                error,
                mapMessage,
                fallback
            );
            return;
        }

        // Error JS biasa
        if (error instanceof Error) {
            validationErrorMessages.value = [error.message];
            return;
        }

        // Fallback terakhir
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

        //global helpers
        alert,
        handleError,
        errorMessages,
        showError,
        error,

        //validation helpers
        validationErrorMessages,
        validationShowError,
        validationError
    }
}