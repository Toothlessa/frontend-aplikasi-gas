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
        error
    }
}