/* ======================================================*
 * IMPORTS                                               *
 * ======================================================*/
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";

import {
    CREATE_CATEGORY_ITEM,
    CREATE_ITEM,
    DEACTIVATE_ITEM,
    DEACTIVATE_ITEM_CATEGORY,
    LOAD_CATEGORY_ITEM,
    LOAD_MASTER_ITEM,
    LOAD_MASTER_ITEM_BY_TYPE,
    SET_HASSAVED,
} from "@/store/storeconstant";

import { CategoryItem, Field, headers, MasterItem } from "@/types";
import { useCategoryItem } from "./useCategoryItem";

/* ======================================================*
 * COMPOSABLE                                            *
 * ======================================================*/
export function useMasterItem() {
    const store = useStore();
    const { categories } = useCategoryItem();

    /* ======================================================*
     * STATE — DIALOG                                        *
     * ======================================================*/
    const dialogDeactivate = ref<boolean>(false);
    const dialogDeactivateCategory = ref<boolean>(false);

    /* ======================================================*
     * STATE — FILTER & SEARCH                               *
     * ======================================================*/
    const search = ref<string>("");
    const itemType = [{ name: "ASSET" }, { name: "ITEM" }];

    /* ======================================================*
     * STATE — TABLE & FORM                                  *
     * ======================================================*/
    const localHeaders = headers;
    const editedIndex = ref<number>(-1);
    const editedItem = reactive<Partial<MasterItem>>({});

    const defaultItem: Partial<MasterItem> = {
        id: 0,
        item_name: "",
        item_code: "",
        item_type: null,
        category_id: null,
        category_name: "",
        cost_of_goods_sold: "",
        selling_price: "",
        in_stock: false,
        active_flag: false,
    };

    /* ======================================================*
     * STATE — CATEGORY                                      *
     * ======================================================*/
    const selectedCategory = ref<Partial<CategoryItem>>({});

    /* ======================================================*
     * STATE — ERROR HANDLING                                *
     * ======================================================*/
    const error = ref<string | string[]>("");
    const showError = ref<boolean>(false);

    /* ======================================================*
     * COMPUTED — FORM FIELDS                                *
     * ======================================================*/
    const allFields = computed<Field[]>(() => [
        {
            model: "item_type",
            label: "Item Type",
            items: itemType.map((it) => it.name),
        },
        {
            model: "category_id",
            label: "Category",
            items: categories.value,
            itemTitle: "name",
            itemValue: "id",
        },
        {
            model: "cost_of_goods_sold",
            label: "Cost of Goods",
        },
        {
            model: "selling_price",
            label: "Selling Price",
            onEnterSubmit: true,
        },
    ]);

    /* ======================================================*
     * COMPUTED — STORE STATE                                *
     * ======================================================*/
    const mItems = computed<MasterItem[]>(
        () => store.state.masteritem.mItems
    );

    const loading = computed<boolean>(
        () => store.state.masteritem.loading
    );

    const hasSaved = computed<boolean>({
        get: () => store.state.masteritem.hasSaved,
        set: (val: boolean) =>
            store.commit(`masteritem/${SET_HASSAVED}`, val),
    });

    /* ======================================================*
     * ACTIONS — STORE DISPATCH                              *
     * ======================================================*/
    const createItem = () =>
        store.dispatch(`masteritem/${CREATE_ITEM}`, editedItem);

    const loadMasterItem = () =>
        store.dispatch(`masteritem/${LOAD_MASTER_ITEM}`);

    const loadMasterItemByType = (itemType: string) =>
        store.dispatch(`masteritem/${LOAD_MASTER_ITEM_BY_TYPE}`, itemType);

    const loadCategories = () =>
        store.dispatch(`masteritem/${LOAD_CATEGORY_ITEM}`);

    const deactiveItem = () =>
        store.dispatch(`masteritem/${DEACTIVATE_ITEM}`, editedItem.id);

    // const createCategory = (item: Partial<CategoryItem>) =>
    //     store.dispatch(`masteritem/${CREATE_CATEGORY_ITEM}`, item);

    // const deactiveCategory = () =>
    //     store.dispatch(`masteritem/${DEACTIVATE_ITEM_CATEGORY}`, editedItem.id);

    /* ======================================================*
     * HANDLERS                                              *
     * ======================================================*/
    const onUpdateCategory = (item: CategoryItem) => {
        selectedCategory.value = { ...item };
    };

    /* ======================================================*
     * EXPORT                                                *
     * ======================================================*/
    return {
        store,

        // dialog
        dialogDeactivate,
        dialogDeactivateCategory,

        // state
        search,
        itemType,
        localHeaders,
        editedIndex,
        editedItem,
        defaultItem,
        selectedCategory,

        // computed
        allFields,
        mItems,
        loading,
        hasSaved,

        // actions
        createItem,
        loadMasterItem,
        loadMasterItemByType,
        loadCategories,
        deactiveItem,
        // createCategory,

        // handlers
        onUpdateCategory,

        // error
        error,
        showError,
    };
}
