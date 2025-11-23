import store from "@/store/store";
import { LOAD_DISPLAY_STOCK, LOAD_STOCK } from "@/store/storeconstant";
import { Stock, StockDetail, stockDetailTableColumn, stockTableColumn } from "@/types";
import { computed, reactive, ref } from "vue";

export function useStock() {
    const DialogDetails = ref(false);
    const DialogUpdate = ref(false);

    const headersStock = stockTableColumn;
    const detailHeaders = stockDetailTableColumn;

    const selectedItem = ref<number | null>(null);
    const search = ref('');
    const loadingButton = ref(false);

    const input = ref('');

    const alert = ref(false);

    const editedStock = reactive({
        item_id: 0,
        stock: 0,
        id: 0,
    });

    const resetEditedStock = () => {
        selectedItem.value = null;
        input.value = '';
    };

    const error = ref<string | string[]>('');
    const showError = ref(false);
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
    /* ----------------------------------------------------
   * COMPUTED
   * ---------------------------------------------------- */
    const stockDisplay = computed(() => store.state.stock.stockDisplay);
    const stocks = computed<Stock[]>(() => store.state.stock.stocks);
    const stockDetails = computed<StockDetail[]>(() => store.state.stock.stockDetails);

    const loading = computed(() => store.getters['stock/loading'])
    const loadingDetail = computed(() => store.getters['stock/loadingDetail'])
    const hasSaved = computed(() => store.getters['stock/hasSaved'])

    const loadCurrentStock = () => store.dispatch(`stock/${LOAD_STOCK}`);

  /* ----------------------------------------------------
   * ACTION FUNCTIONS
   * ---------------------------------------------------- */  

  const loadDisplayStock = async () => {
    try{
        await store.dispatch(`stock/${LOAD_DISPLAY_STOCK}`, { filledId: 61, emptyId: 62});

    }catch(error){
        handleError(error);
    }
  }

    return {
        DialogDetails,
        DialogUpdate,

        headersStock,
        detailHeaders,

        search,
        input,
        selectedItem,
        stocks,
        stockDetails,
        editedStock,

        loadingButton,
        loading,
        loadingDetail,
        hasSaved,

        alert,
        error,

        loadCurrentStock,
        resetEditedStock,
        handleError,

        loadDisplayStock,
        stockDisplay,
    };
}