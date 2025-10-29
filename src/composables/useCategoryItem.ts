import store from "@/store/store";
import { CategoryItem, headerscategory } from "@/types";
import { computed, reactive, ref } from "vue";

export function useCategoryItem() {

    const DialogOpenCategory = ref<boolean>(false);
    const DialogOpenCreate = ref<boolean>(false);

     const searchCategory = ref<string>('');
     const localHCategory = headerscategory;
    const newCategory = reactive<Partial<CategoryItem>>({
        name: '',
        active_flag: true,
        inactive_date: '',
    });
    const defaultCategory: Partial<CategoryItem> = {
        id: 0,
        name: '',
        active_flag: true,
        inactive_date: '',
    };
    const selectedCategory = ref<Partial<CategoryItem>>({});
    
    const categories = computed<CategoryItem[]>(() => store.state.masteritem.categories);
    const onUpdateCategory = (item: CategoryItem) => {
        selectedCategory.value = { ...item }; // Set item to pass to the dialog
    };
    const onClose = () => {
        DialogOpenCategory.value = false;                         // Close the dialog
        Object.assign(selectedCategory, defaultCategory );        // Clear the selected data
    };

    return {
        DialogOpenCategory,
        DialogOpenCreate,

        searchCategory,
        newCategory,
        defaultCategory,
        selectedCategory,
        localHCategory,

        categories,

        onUpdateCategory,
        onClose,
    }
}