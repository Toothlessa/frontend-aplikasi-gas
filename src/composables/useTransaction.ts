import store from "@/store/store";
import {
  CREATE_TRANSACTION,
  LOAD_LAST_30_DAYS_TRANSACTION,
  LOAD_OUTSTANDING_TRANSACTION,
  LOAD_TRANSACTION_BY_DATE
} from "@/store/storeconstant";
import {
  headerOutstanding,
  headerTransaction,
  Transaction
} from "@/types/Transaction";
import { computed, reactive, ref } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";

export function useTransaction() {
  const theme = useTheme();

  /* ----------------------------------------------------*
   * CONSTANTS                                           *
   * ----------------------------------------------------*/
  const search = ref("");
  const editedIndex = ref(-1);

  // Dialogs
  const DialogDate = ref(false);
  const DialogUpdate = ref(false);
  const DialogUpdateDescription = ref(false);

  // UI State
  const isEditAmt = ref(false);
  const isEditing = ref(false);
  const isSend = ref(false);
  const fieldDisabled = ref(true);
  const alert = ref(false);

  // Date Filter
  const dateTitle = ref("");
  const pickDate = ref(new Date());

  // Table Headers
  const headersLocal = headerTransaction;
  const headersOutsandingLocal = headerOutstanding;

  const transactionUpdate = reactive<Partial<Transaction>>({});
  const transactionUpdateDescription = reactive<Partial<Transaction>>({});

  /* -----------------------------------------------------*
   * LOCALS FUNCTIONS                                     *
   * -----------------------------------------------------*/
  const defaultItem: Partial<Transaction> = {
    id: null,
    quantity: null,
    stock: 0,
    amount: 19000,
    total: 0,
    description: "",
    item_id: 61,
    stockId: 0,
    customer_id: null
  };

  const transactionData = reactive<Partial<Transaction>>({
    amount: 19000,
    item_id: 61
  });

  // Price Options
  const price = [
    { name: "Rp 16.000", value: 16000 },
    { name: "Rp 17.000", value: 17000 },
    { name: "Rp 18.000", value: 18000 },
    { name: "Rp 19.000", value: 19000 },
    { name: "Rp 20.000", value: 20000 }
  ];

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

  const editTransaction = (item: Transaction) => {
    editedIndex.value = transactions.value.findIndex(t => t.id === item.id);
    Object.assign(transactionUpdate, item);
    DialogUpdate.value = true;
  };

  const close = () => {
    DialogUpdate.value = false;
    setTimeout(() => {
      resetTransactionData();
      resetTransactionUpdate();
      editedIndex.value = -1;
    }, 300);
  };

  const checkIsSend = () => {
    transactionData.amount = isSend.value ? 19000 : 20000;
  };

  /* ----------------------------------------------------*
   * STATE - VARIABLE                                    *
   * ----------------------------------------------------*/
  const loading = computed(
    () => store.getters["transaction/loading"]
  );

  const loadingData = computed(
    () => store.state.transaction.loadingData
  );

  const loadingButtonSave = computed(
    () => store.getters["transaction/loadingButtonCreate"]
  );

  const loadingButtonUpdate = computed(
    () => store.getters["transaction/loadingButtonUpdate"]
  );

  /* ---------------------------------------------------*
  * STATE - DATA                                        *
  * ----------------------------------------------------*/

  const hasSaved = computed(
    () => store.getters["transaction/hasSaved"]
  );

  const isSaveDisabled = computed(
    () => !(transactionData.customer_id && transactionData.quantity)
  );

  const isUpdateDisabled = computed(
    () => !(transactionUpdate.customer_id && transactionUpdate.quantity)
  );

  const transactions = computed<Transaction[]>(
    () => store.getters["transaction/transactions"]
  );

  const outstandingTransaction = computed(
    () => store.state.transaction.outstandingTransaction
  );

  const last30DaysTransaction = computed(
    () => store.state.transaction.dailySaleTransaction
  );

  /* ----------------------------------------------------
   * ACTIONS
   * ---------------------------------------------------- */
  const fetchLast30DaysSale = () => store.dispatch(`transaction/${LOAD_LAST_30_DAYS_TRANSACTION}`);
  const fetchOustandingTransaction = () => store.dispatch(`transaction/${LOAD_OUTSTANDING_TRANSACTION}`);
  const createTransaction = (postData: Transaction) => store.dispatch(`transaction/${CREATE_TRANSACTION}`, postData);
  const updateDescriptionTransaction = () => store.dispatch(`transaction/${CREATE_TRANSACTION}`, transactionUpdateDescription);
  const getTransactionByDate = () => store.dispatch(`transaction/${LOAD_TRANSACTION_BY_DATE}`, getDateOptions(pickDate.value ?? new Date()));


  /* ----------------------------------------------------
   * RETURN API
   * ---------------------------------------------------- */
  return {
    // theme
    theme,

    // dialogs
    DialogDate,
    DialogUpdate,
    DialogUpdateDescription,

    // state
    search,
    editedIndex,
    transactionData,
    transactionUpdate,
    transactionUpdateDescription,
    isEditAmt,
    isEditing,
    isSend,
    hasSaved,
    loadingButtonSave,
    loadingButtonUpdate,
    fieldDisabled,
    alert,

    // headers & static
    headersLocal,
    headersOutsandingLocal,
    price,

    // date
    dateTitle,
    pickDate,

    // computed
    transactions,
    outstandingTransaction,
    last30DaysTransaction,
    loading,
    loadingData,
    isSaveDisabled,
    isUpdateDisabled,

    // utilities
    getColorByDescription,
    getDateOptions,

    resetTransactionData,
    resetTransactionUpdate,

    // actions
    createTransaction,
    updateDescriptionTransaction,
    editTransaction,
    close,
    checkIsSend,
    getTransactionByDate,
    fetchOustandingTransaction,
    fetchLast30DaysSale
  };
}
