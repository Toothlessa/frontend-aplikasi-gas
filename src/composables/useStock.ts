import store from "@/store/store";
import { LOAD_DETAIL_STOCK, LOAD_STOCK } from "@/store/storeconstant";
import { Stock, StockDetail, stockDetailTableColumn, stockTableColumn } from "@/types";
import { computed, reactive, ref } from "vue";

export function useStock() {
    
    const DialogDetails = ref(false);
    const DialogUpdate = ref(false);

    const headersStock = stockTableColumn;
    const detailHeaders = stockDetailTableColumn;

    const selectedItem = ref<number | null>(null);

    //const detailStock = ref<StockDetail[]>([]);
    const editedStock = reactive({
        item_id: null as number | null,
        stock: null as number | null,
        id: null as number | null,
    });

    const stocks = computed<Stock[]>(() => store.state.stock.stocks);
    const stockDetails = computed<StockDetail[]>(() => store.state.stock.stockDetails);

    const loading = computed<boolean>(() => store.state.stock.loading);
    const loadingDetail = computed<boolean>(() => store.state.stock.loading);
    const hasSaved = computed<boolean>(() => store.state.stock.hasSaved);

    const loadCurrentStock = () => store.dispatch(`stock/${LOAD_STOCK}`);


    return {
        DialogDetails,
        DialogUpdate,

        headersStock,
        detailHeaders,

        selectedItem,
        stocks,
        stockDetails,
        editedStock,

        loading,
        loadingDetail,
        hasSaved,
        loadCurrentStock,
    };
}