import store from "@/store/store";
import { computed, ref } from "vue";

export function useGlobal() {

    const search = ref('');
    const loadingButton = ref(false);

    const input = ref('');
    const hasSaved = ref(false);

    const alert = ref(false);
    const error = ref('');

    return {
        search,
        loadingButton,
        input,
        hasSaved,
        alert,
        error,
        
    };
}