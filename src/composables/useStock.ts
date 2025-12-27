import store from '@/store/store';
import { CREATE_STOCK, LOAD_DISPLAY_STOCK, LOAD_STOCK } from '@/store/storeconstant';
import {
    Stock,
    StockDetail,
    stockDetailTableColumn,
    stockTableColumn,
} from '@/types';
import { computed, reactive, ref } from 'vue';

export function useStock() {
    /* ======================================================*
     * STATE — DIALOG                                         *
     * ======================================================*/
    const DialogDetails = ref<boolean>(false);
    const DialogUpdate = ref<boolean>(false);

    /* ======================================================*
     * STATE — TABLE HEADERS                                  *
     * ======================================================*/
    const headersStock = stockTableColumn;
    const detailHeaders = stockDetailTableColumn;

    /* ======================================================*
     * STATE — SELECTION & INPUT                              *
     * ======================================================*/
    const selectedItem = ref<number | null>(null);
    const search = ref<string>('');
    const input = ref<string>('');

    /* ======================================================*
     * STATE — LOADING & ALERT                                *
     * ======================================================*/
    const loadingButton = ref<boolean>(false);
    const alert = ref<boolean>(false);

    /* ======================================================*
     * STATE — EDITED STOCK                                   *
     * ======================================================*/
    const editedStock = reactive({
        item_id: 0,
        stock: 0,
        id: 0,
    });

    /* ======================================================*
     * STATE — ERROR HANDLING                                 *
     * ======================================================*/
    const error = ref<string | string[]>('');
    const showError = ref<boolean>(false);

    const handleError = (e: unknown) => {
        showError.value = true;

        if (Array.isArray(e)) {
            error.value = e;
        } else if (e instanceof Error) {
            error.value = e.message;
        } else {
            error.value = String(e);
        }
    };

    /* ======================================================*
     * COMPUTED — STORE STATE                                 *
     * ======================================================*/
    const stockDisplay = computed(() => store.state.stock.stockDisplay);
    const stocks = computed<Stock[]>(() => store.state.stock.stocks);
    const stockDetails = computed<StockDetail[]>(() => store.state.stock.stockDetails);

    /* ======================================================*
     * COMPUTED — STORE GETTERS                               *
     * ======================================================*/
    const loading = computed(() => store.getters['stock/loading']);
    const loadingDetail = computed(() => store.getters['stock/loadingDetail']);
    const hasSaved = computed(() => store.getters['stock/hasSaved']);

    /* ======================================================*
     * ACTIONS — LOCAL                                        *
     * ======================================================*/
    const resetEditedStock = () => {
        selectedItem.value = null;
        input.value = '';
    };

    /* ======================================================*
     * ACTIONS — STORE                                       *
     * ======================================================*/
    const createStock = () => store.dispatch(`stock/${CREATE_STOCK}`, {
        itemId: selectedItem.value,
        stock: input.value,
    });

    const loadCurrentStock = () =>
        store.dispatch(`stock/${LOAD_STOCK}`);

    const loadDisplayStock = async () => {
        try {
            await store.dispatch(`stock/${LOAD_DISPLAY_STOCK}`, {
                filledId: 61,
                emptyId: 62,
            });
        } catch (err) {
            handleError(err);
        }
    };

    /* ======================================================*
     * EXPOSED API                                            *
     * ======================================================*/
    return {
        // Dialog
        DialogDetails,
        DialogUpdate,

        // Headers
        headersStock,
        detailHeaders,

        // State
        search,
        input,
        selectedItem,
        editedStock,

        // Data
        stocks,
        stockDetails,
        stockDisplay,

        // Loading & Flags
        loadingButton,
        loading,
        loadingDetail,
        hasSaved,
        alert,
        error,

        // Actions
        createStock,
        resetEditedStock,
        loadCurrentStock,
        loadDisplayStock,
        handleError,
    };
}
