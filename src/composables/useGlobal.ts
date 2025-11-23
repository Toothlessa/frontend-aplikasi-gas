import { ref } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useStore } from "vuex";

export function useGlobal() {
    
    const store = useStore();
    const router = useRouter();
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

    return {
        store,
        router,
        theme,
        
        search,
        /* formatter and ultilities */
        formatPrice,
    }
}