import store from '@/store/store';
import {
    CREATE_STOCK,
    LOAD_DETAIL_STOCK,
    LOAD_DISPLAY_STOCK,
    LOAD_STOCK,
    RESET_DETAIL_STOCK,
    UPDATE_STOCK
} from '@/store/storeconstant';
import {
    Stock,
    StockDetail,
    stockDetailTableColumn,
    stockTableColumn,
} from '@/types';
import { computed, reactive, ref } from 'vue';

export function useStock() {
    /* ======================================================*
     * CONSTANTS                                             *
     * ======================================================*/
    const DialogDetails = ref<boolean>(false);
    const DialogUpdate = ref<boolean>(false);

    const headersStock = stockTableColumn;
    const detailHeaders = stockDetailTableColumn;

    const selectedItem = ref<number | null>(null);
    const search = ref<string>('');
    const input = ref<string>('');

    const loadingButton = ref<boolean>(false);

    /* ======================================================*
     * LOCAL FUNCTIONS                                       *
     * ======================================================*/
    const editedStock = reactive({
        item_id: 0,
        stock: 0,
        id: 0,
    });

    const resetEditedStock = () => {
        selectedItem.value = null;
        input.value = '';
    };

    /* ======================================================*
     * STORE GETTERS                                         *
     * ======================================================*/
    const loading = computed(() => store.getters['stock/loading']);
    const loadingDetail = computed(() => store.getters['stock/loadingDetail']);
    const hasSaved = computed(() => store.getters['stock/hasSaved']);

    /* ======================================================*
     * STORE DATA                                            *
     * ======================================================*/
    const stockDisplay = computed(() => store.state.stock.stockDisplay);
    const stocks = computed<Stock[]>(() => store.state.stock.stocks);
    const stockDetails = computed<StockDetail[]>(() => store.state.stock.stockDetails);

    /* ======================================================*
     * STORE ACTIONS                                         *
     * ======================================================*/
    const createStock = () => store.dispatch(`stock/${CREATE_STOCK}`, {
        itemId: selectedItem.value,
        stock: { stock: Number(input.value) },
    });
    const loadDetailStock = (item_id: number) => store.dispatch(`stock/${LOAD_DETAIL_STOCK}`, item_id);
    const resetStockDetail = () => store.dispatch(`stock/${RESET_DETAIL_STOCK}`);
    const loadCurrentStock = () => store.dispatch(`stock/${LOAD_STOCK}`);
    const loadDisplayStock = () => store.dispatch(`stock/${LOAD_DISPLAY_STOCK}`, { filledId: 61, emptyId: 62 });
    const updateStock = (id: number, stock: number) => store.dispatch(`stock/${UPDATE_STOCK}`, {
        id,
        stock: { stock }
    });

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

        // Actions
        createStock,
        updateStock,
        loadDetailStock,
        resetStockDetail,
        resetEditedStock,
        loadCurrentStock,
        loadDisplayStock,
    };
}
