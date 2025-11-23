import { ref, reactive, computed } from 'vue';
import store from '@/store/store';
import {
  CREATE_CUSTOMER,
  DEACTIVATE_CUSTOMER,
  LOAD_CUSTOMER_DATA,
  LOAD_TOP_CUSTOMER_TRANSACTION,
  SET_HASSAVED,
  UPDATE_CUSTOMER,
  UPLOAD_CUSTOMER,
} from '@/store/storeconstant';
import { headerCustomer, type Customer, type CustomerField } from '@/types/Customer';

export function useCustomer() {

  // Dialogs
  const DialogOpenCreate = ref(false);
  const DialogOpenDeactive = ref(false);
  const DialogOpenUploadCustomer = ref(false);

  const DialogCreateCustomer = () => {
    resetEditedItem();
    error.value = '';
    DialogOpenCreate.value = true;
  };

  const DialogClose = () => {
    DialogOpenCreate.value = false;
    DialogOpenDeactive.value = false;
    DialogOpenUploadCustomer.value = false;
  };

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
  const topCustomerTransaction = computed(() => store.state.customer.topCustomerTransaction ?? []);

  const labels = computed(() => topCustomerTransaction.value.map(item => item.customer_name));
  const totals = computed(() => topCustomerTransaction.value.map(item => item.total));

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

  const onCreateCustomer = async () => {
    error.value = '';
    try {
      await store.dispatch(`customer/${CREATE_CUSTOMER}`, editedItem);
      DialogClose();
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateCustomer = async () => {
    try {
      await store.dispatch(`customer/${UPDATE_CUSTOMER}`, editedItem);
      DialogClose();
    } catch (e) {
      handleError(e);
    }
  };

  const onDeactivated = async () => {
    try {
      error.value = '';
      await store.dispatch(`customer/${DEACTIVATE_CUSTOMER}`, editedItem.id);
      DialogClose();
    } catch (e) {
      handleError(e);
    }
  };

  const onUploadCustomer = async () => {
    if (!csvFile.value) {
      handleError('Please select a CSV file to upload.');
      return;
    }
    uploading.value = true;
    try {
      await store.dispatch(`customer/${UPLOAD_CUSTOMER}`, csvFile.value);
      DialogClose();
      csvFile.value = null;
    } catch (e) {
      handleError(e);
    } finally {
      uploading.value = false;
    }
  };

  const loadTopCustomerTransaction = async () => {
    try {
      await store.dispatch(`customer/${LOAD_TOP_CUSTOMER_TRANSACTION}`);
    } catch (error) {
      handleError(error);
    }
  };

  //const methods
  const editItem = (item: Customer) => {
    editedIndex.value = customers.value.indexOf(item);
    Object.assign(editedItem, item);
    error.value = '';
    DialogOpenCreate.value = true;
  };

  const onSubmit = (item: Partial<Customer>) => {
    Object.assign(editedItem, item);
    onCreateCustomer();
  };

  const onUpdate = (item: Partial<Customer>) => {
    Object.assign(editedItem, item);
    onUpdateCustomer();
  }

  const deactivateCustomer = (item: Customer) => {
    Object.assign(editedItem, item);
    DialogOpenDeactive.value = true;
  };

  return {
    DialogOpenCreate,
    DialogOpenDeactive,
    DialogOpenUploadCustomer,
    DialogCreateCustomer,
    DialogClose,

    search,

    editedIndex,
    editedItem,
    defaultItem,

    csvFile,
    uploading,

    headersLocal,

    allFields,
    topCustomerTransaction,
    labels,
    totals,
    customers,
    loading,
    hasSaved,
    isEditMode,

    loadCustomerData,
    resetEditedItem,
    handleError,

    editItem,
    onSubmit,
    onUpdate,
    deactivateCustomer,
    onDeactivated,
    onUploadCustomer,
    loadTopCustomerTransaction,

    error,
    showError,
    errorMessages,
  };
}
