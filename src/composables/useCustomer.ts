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

/* ======================================================
 * COMPOSABLE
 * ====================================================== */
export function useCustomer() {

  /* ======================================================
   * STATE — DIALOG CONTROL
   * ====================================================== */
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

  /* ======================================================
   * STATE — SEARCH & FORM
   * ====================================================== */
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

  /* ======================================================*
   * STATE — FILE UPLOAD                                   *
   * ======================================================*/
  const csvFile = ref<File | null>(null);
  const uploading = ref(false);

  /* ======================================================*
   * STATE — TABLE & UI
   * ====================================================== */

  const error = ref<string | string[]>('');

  /* ======================================================
   * COMPUTED — FORM FIELDS
   * ====================================================== */
  const allFields = computed<CustomerField[]>(() => [
    { model: 'customer_name', label: 'Customer Name' },
    { model: 'customer_type', label: 'Type' },
    { model: 'nik', label: 'NIK' },
    { model: 'email', label: 'E-Mail', onEnterSubmit: true },
    { model: 'address', label: 'Address', onEnterSubmit: true },
    { model: 'phone', label: 'Phone', onEnterSubmit: true },
  ]);

  /* ======================================================*
   * COMPUTED — STORE STATE                                *
   * ======================================================*/
  const customers = computed(() => store.state.customer.customers);
  const topCustomerTransaction = computed(
    () => store.state.customer.topCustomerTransaction ?? []
  );

  const loading = computed(() => store.state.customer.loading);
  const loadingButtonCreate = computed(() => store.state.customer.loadingButtonCreate);

  const hasSaved = computed({
    get: () => store.state.customer.hasSaved,
    set: (val: boolean) =>
      store.commit(`customer/${SET_HASSAVED}`, val),
  });

  const isEditMode = computed(() => editedIndex.value !== -1);

  /* ======================================================
   * COMPUTED — CHART DATA
   * ====================================================== */
  const labels = computed(() =>
    topCustomerTransaction.value.map(item => item.customer_name)
  );

  const totals = computed(() =>
    topCustomerTransaction.value.map(item => item.total)
  );

  /* ======================================================
   * VUEX ACTIONS — LOAD & RESET
   * ====================================================== */
  const loadCustomerData = () =>
    store.dispatch(`customer/${LOAD_CUSTOMER_DATA}`);

  const loadTopCustomerTransaction = () =>
    store.dispatch(`customer/${LOAD_TOP_CUSTOMER_TRANSACTION}`);

  const createCustomer = () =>
    store.dispatch(`customer/${CREATE_CUSTOMER}`, editedItem);

  const updateCustomer = () =>
    store.dispatch(`customer/${UPDATE_CUSTOMER}`, editedItem);

  const deactivateCustomer = () =>
    store.dispatch(`customer/${DEACTIVATE_CUSTOMER}`, editedItem.id);

  const uploadCustomer = () =>
    store.dispatch(`customer/${UPLOAD_CUSTOMER}`, csvFile.value);

  const resetEditedItem = () => {
    Object.assign(editedItem, defaultItem);
    editedIndex.value = -1;
  };

  /* ======================================================*
   * EXPORTS                                               *
   * ====================================================== */
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

    headerCustomer,

    allFields,
    topCustomerTransaction,
    labels,
    totals,
    customers,
    loading,
    loadingButtonCreate,
    hasSaved,
    isEditMode,

    createCustomer,
    updateCustomer,
    loadCustomerData,
    resetEditedItem,

    deactivateCustomer,
    uploadCustomer,
    loadTopCustomerTransaction,
  };
}
