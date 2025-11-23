import store from "@/store/store";
import { CREATE_TRANSACTION, LOAD_TRANSACTION_BY_DATE } from "@/store/storeconstant";
import { headerTransaction, Transaction } from "@/types/Transaction";
import { computed, reactive, ref } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";

export function useTransaction() {
  /* ----------------------------------------------------
   * THEME
   * ---------------------------------------------------- */
  const theme = useTheme();

  /* ----------------------------------------------------
   * STATE
   * ---------------------------------------------------- */
  const search = ref("");
  const editedIndex = ref(-1);

  // Dialogs
  const DialogDate = ref(false);
  const DialogUpdate = ref(false);

  // UI State
  const isEditAmt = ref(false);
  const isEditing = ref(false);
  const isSend = ref(false);
  const fieldDisabled = ref(true);
  const alert = ref(false);

  // Error State
  const showError = ref(false);
  const error = ref<string | string[] | undefined>();

  // Date Filter
  const dateTitle = ref("");
  const pickDate = ref(new Date());

  // Table Headers
  const headersLocal = headerTransaction;

  // Static Price Options
  const price = [
    { name: "Rp 16.000", value: 16000 },
    { name: "Rp 17.000", value: 17000 },
    { name: "Rp 18.000", value: 18000 },
    { name: "Rp 19.000", value: 19000 },
    { name: "Rp 20.000", value: 20000 }
  ];

  /* ----------------------------------------------------
   * REACTIVE OBJECTS
   * ---------------------------------------------------- */
  const transactionData = reactive<Partial<Transaction>>({
    amount: 19000,
    item_id: 61,
  });
  const transactionUpdate = reactive<Partial<Transaction>>({});

  const defaultItem: Partial<Transaction> = {
    id: null,
    quantity: null,
    stock: 0,
    amount: 19000,
    total: 0,
    description: '',
    item_id: 61,
    stockId: 0,
    customer_id: null,
  };
  const resetTransactionData = () => {
    Object.assign(transactionData, defaultItem);
    editedIndex.value = -1;
    isSend.value = false;
  };
  const resetTransactionUpdate = () => {
    Object.assign(transactionUpdate, defaultItem);
    editedIndex.value = -1;
    isSend.value = false;
  };

  /* ----------------------------------------------------
   * FORMATTERS & UTILITIES
   * ---------------------------------------------------- */
  const getColorByDescription = (description: string | null) => {
    if (!description) return "grey";

    const text = description.toLowerCase();

    if (text.startsWith("kirim")) return "cyan";
    if (text.startsWith("titip")) return "orange";
    if (text.startsWith("pisah")) return "deep-purple";
    if (text.startsWith("uang")) return "amber";
    if (text.startsWith("done")) return "green";

    return "yellow";
  };

  const getDateOptions = (dateConv: Date) => {
    const date = new Date(dateConv);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  };

  /* ----------------------------------------------------
   * COMPUTED
   * ---------------------------------------------------- */
  const transactions = computed<Transaction[]>(() => store.getters["transaction/transactions"] as Transaction[]);
  const loading = computed(() => store.getters[`transaction/loading`]);
  const loadingButtonSave = computed(() => store.getters[`transaction/loadingButtonCreate`]);
  const loadingButtonUpdate = computed(() =>store.getters[`transaction/loadingButtonUpdate`]);
  const hasSaved = computed(() =>store.getters[`transaction/hasSaved`]);

  const isSaveDisabled = computed(
    () => !(transactionData.customer_id && transactionData.quantity)
  );

  const isUpdateDisabled = computed(
    () => !(transactionUpdate.customer_id && transactionUpdate.quantity)
  );

  /* ----------------------------------------------------
   * ACTION FUNCTIONS
   * ---------------------------------------------------- */  
  const save = async () => {
  try {
    error.value = '';

    let postData;

    if (editedIndex.value > -1) {
      // UPDATE
      transactionUpdate.stock =  -(transactionUpdate.quantity || 1);
      transactionUpdate.total = (transactionUpdate.amount || 0) * (transactionUpdate.quantity || 1);
      postData = JSON.parse(JSON.stringify(transactionUpdate));
    } else {
      // CREATE
      transactionData.quantity = transactionData.quantity || 1;
      transactionData.stock = -(transactionData.quantity || 1);
      transactionData.total = (transactionData.amount || 0) * (transactionData.quantity || 1);
      postData = JSON.parse(JSON.stringify(transactionData));
    }

    console.log('Sending to backend:', postData);

    await store.dispatch(`transaction/${CREATE_TRANSACTION}`, postData);
    // getTransactionByDate();

    resetTransactionData();
    DialogUpdate.value = false;
  } catch (e) {
    handleError(e);
  }
};

const getTransactionByDate = async () => {
    try {
      const formattedDate = getDateOptions(pickDate.value);

      store.dispatch(`transaction/${LOAD_TRANSACTION_BY_DATE}`, formattedDate);

      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric"
      };

      dateTitle.value = pickDate.value.toLocaleDateString("id-ID", options);
      fieldDisabled.value = getDateOptions(new Date()) === formattedDate;
    } catch (e) {
      handleError(e);
    }
  };

const editTransaction = (item: Transaction) => {
  editedIndex.value = transactions.value.findIndex(t => t.id === item.id);
  Object.assign(transactionUpdate, item);
  DialogUpdate.value = true;
};

  const close = () => {
    DialogUpdate.value = false;
    setTimeout(() => {
      resetTransactionData;
      resetTransactionUpdate;
      editedIndex.value = -1;
    }, 300);
  };

  const checkIsSend = () => {
    transactionData.amount = isSend.value ? 19000 : 20000;
  };

  const handleError = (e: unknown) => {
    showError.value = true;

    if (Array.isArray(e)) error.value = e;
    else if (e instanceof Error) error.value = e.message;
    else error.value = String(e);
  };

  /* ----------------------------------------------------
   * RETURN API
   * ---------------------------------------------------- */
  return {
    // theme
    theme,

    // state
    search,
    editedIndex,
    transactionData,
    transactionUpdate,
    DialogDate,
    DialogUpdate,
    isEditAmt,
    isEditing,
    isSend,
    hasSaved,
    loadingButtonSave,
    loadingButtonUpdate,
    fieldDisabled,
    alert,

    // headers
    headersLocal,

    // error
    showError,
    error,

    // date filter
    dateTitle,
    pickDate,

    // static
    price,

    // computed
    transactions,
    loading,
    isSaveDisabled,
    isUpdateDisabled,

    // utility functions
    getColorByDescription,
    getDateOptions,

    // actions
    save,
    editTransaction,
    close,
    resetTransactionData,
    checkIsSend,
    handleError,
    getTransactionByDate
  };
}
