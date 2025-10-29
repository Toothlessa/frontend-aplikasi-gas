import { ref, reactive, computed } from 'vue';
import store from '@/store/store';
import { 
  LOAD_CUSTOMER_DATA, 
  SET_HASSAVED, 
} from '@/store/storeconstant';
import { headerCustomer, type Customer, type CustomerField } from '@/types/Customer';

export function useCustomer() {
    const search = ref('');

    const editedIndex = ref(-1);
    const editedItem = reactive<Partial<Customer>>({});
    const defaultItem: Partial<Customer> = {
    id: 0,
    customer_name: '',
    customer_type: '',
    nik: '',
    email: '',
    address: '',
    phone: '',
    active_flag: false,
    };

    const csvFile = ref<File | null>(null);
    const uploading = ref(false);

    const headersLocal = headerCustomer;

    const error = ref<string | string[]>('');
    const showError = ref(false);

    // Computed Properties
    const allFields = computed<CustomerField[]>(() => [
        { model: 'customer_name', label: 'Customer Name' },
        { model: 'customer_type', label: 'Type' },
        { model: 'nik', label: 'NIK' },
        { model: 'email', label: 'E-Mail', onEnterSubmit: true },
        { model: 'address', label: 'Address', onEnterSubmit: true },
        { model: 'phone', label: 'Phone', onEnterSubmit: true },
    ]);

    const customers = computed(() => store.state.customer.customers);
    const loading = computed(() => store.state.customer.loading);
    const hasSaved = computed({
        get: () => store.state.customer.hasSaved,
        set: (val: boolean) => store.commit(`customer/${SET_HASSAVED}`, val),
    });
    const isEditMode = computed(() => editedIndex.value !== -1);
    const errorMessages = computed(() => Array.isArray(error.value) ? error.value : [error.value]);

    // Methods
    const loadCustomerData = () => store.dispatch(`customer/${LOAD_CUSTOMER_DATA}`);
    const resetEditedItem = () => {
        Object.assign(editedItem, defaultItem);
        editedIndex.value = -1;
    };
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

  return {
    search,

    editedIndex,
    editedItem,
    defaultItem,

    csvFile,
    uploading,

    headersLocal,

    allFields,
    customers,
    loading,
    hasSaved,
    isEditMode,

    loadCustomerData,
    resetEditedItem,
    handleError,

    error,
    showError,
    errorMessages,
  };
}
