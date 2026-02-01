import { computed, reactive, ref } from "vue";

import store from "@/store/store";
import { CategoryItem, headerscategory } from "@/types";
import { CREATE_CATEGORY_ITEM, DEACTIVATE_ITEM_CATEGORY } from "@/store/storeconstant";

export function useCategoryItem() {

    /* ======================================================*
     * STATE — DIALOG                                        *
     * ======================================================*/
    const DialogOpenCategory = ref<boolean>(false);
    const DialogOpenCreate = ref<boolean>(false);

    /* -----------------------------------------------------*
     * STATE — SEARCH & TABLE                               *
     * -----------------------------------------------------*/
    const searchCategory = ref<string>("");
    const localHCategory = headerscategory;

    /* -----------------------------------------------------*
     * STATE — FORM                                         *
     * -----------------------------------------------------*/
    const newCategory = reactive<Partial<CategoryItem>>({
        name: "",
        active_flag: true,
        inactive_date: "",
    });

    const defaultCategory: Partial<CategoryItem> = {
        id: 0,
        name: "",
        active_flag: true,
        inactive_date: "",
    };

    const selectedCategory = ref<Partial<CategoryItem>>({});

    /* ======================================================*
     * COMPUTED PROPERTIES                                   *
     * ======================================================*/
    const categories = computed<CategoryItem[]>(
        () => store.state.masteritem.categories
    );

    /* ======================================================*
     * HANDLERS                                              *
     * ======================================================*/
    const onUpdateCategory = (item: CategoryItem) => {
        selectedCategory.value = { ...item };
    };

    const onClose = () => {
        DialogOpenCategory.value = false;
        Object.assign(selectedCategory, defaultCategory);
    };

    /* ======================================================*
     * VUEX API's                                            *
     * ======================================================*/
    const createCategory = (item: Partial<CategoryItem>) => {
        store.dispatch(`masteritem/${CREATE_CATEGORY_ITEM}`, item);
    };

    const deactiveCategory = () => {
        store.dispatch(`masteritem/${DEACTIVATE_ITEM_CATEGORY}`, newCategory.id);
    };

    /* ======================================================*
     * EXPORT                                                *
     * ======================================================*/
    return {
        // dialog
        DialogOpenCategory,
        DialogOpenCreate,

        // state
        searchCategory,
        newCategory,
        defaultCategory,
        selectedCategory,
        localHCategory,

        // computed
        categories,

        // handlers
        onUpdateCategory,
        onClose,

        createCategory,
        deactiveCategory,
    };
}
