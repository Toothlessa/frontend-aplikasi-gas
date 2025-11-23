import { LOAD_CATEGORY_ITEM, LOAD_MASTER_ITEM, LOAD_MASTER_ITEM_BY_TYPE, SET_HASSAVED } from "@/store/storeconstant";
import { CategoryItem, Field, headers, MasterItem } from "@/types";
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";
import { useCategoryItem } from "./useCategoryItem";

export function useMasterItem() {
    const {
        categories,
    } = useCategoryItem();
    const dialogDeactivate = ref<boolean>(false);
    const dialogDeactivateCategory = ref<boolean>(false);

    const store = useStore();
    const search = ref<string>('');
    const itemType = [ { name: "ASSET" }, { name: "ITEM" },];
    const localHeaders = headers; // Use the imported headers directly
    const editedIndex = ref(-1);
    const editedItem = reactive<Partial<MasterItem>>({});
    const defaultItem: Partial<MasterItem> = {
        id: 0,
        item_name: '',
        item_code: '',
        item_type: null,
        category_id: null,
        category_name: '',
        cost_of_goods_sold: '',
        selling_price: '',
        in_stock: false,
        active_flag: false,
    };


    const allFields = computed<Field[]>(() => [
        { model: 'item_type', label: 'Item Type', items: itemType.map(it => it.name) },
        { model: 'category_id', label: 'Category', items: categories.value, itemTitle: 'name', itemValue: 'id' },
        { model: 'cost_of_goods_sold', label: 'Cost of Goods' },
        { model: 'selling_price', label: 'Selling Price',  onEnterSubmit: true },
    ]);

    // computed properties
    const mItems = computed<MasterItem[]>(() => store.state.masteritem.mItems);
    const loading = computed<boolean>(() => store.state.masteritem.loading);
    const loadMasterItem = () => store.dispatch(`masteritem/${LOAD_MASTER_ITEM}`);
    const loadMasterItemByType = (itemType: string) => store.dispatch(`masteritem/${LOAD_MASTER_ITEM_BY_TYPE}`, itemType);
    const loadCategories = () => store.dispatch(`masteritem/${LOAD_CATEGORY_ITEM}`);

    const hasSaved = computed({
        get: () => store.state.masteritem.hasSaved,
        set: (val: boolean) => { store.commit(`masteritem/${SET_HASSAVED}`, val); },
    });

    const selectedCategory = ref<Partial<CategoryItem>>({});
    const onUpdateCategory = (item: CategoryItem) => {
        selectedCategory.value = { ...item }; // Set item to pass to the dialog
    };


    const error = ref<string | string[]>('');
    const showError = ref<boolean>(false);

    return {
        store,
        
        dialogDeactivate,
        dialogDeactivateCategory,

        search,
        editedIndex,
        editedItem,
        defaultItem,
        itemType,
        localHeaders,
        allFields,
        selectedCategory,

        mItems,
        loadMasterItem,
        loadMasterItemByType,
        loadCategories,
        onUpdateCategory,

        hasSaved,
        loading,
        error,
        showError,
    }

}