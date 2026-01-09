import { ref, reactive, computed } from "vue";
import store from "@/store/store";
import {
  CREATE_DEBT,
  LOAD_DATA_DEBT,
  LOAD_DATA_OUTSTANDING_DEBT,
  LOAD_DATA_SUMMARY_DEBT,
  RESET_DETAIL_DEBT,
  UPDATE_DEBT,
} from "@/store/storeconstant";
import {
  Debt,
  headerDetailDebt,
  headerOutstandingDebt,
  headerSummaryDebt,
  SummaryDebt,
} from "@/types";

export function useDebt() {

  /* -----------------------------------------------------*
   * STATE ref & reactive                                 *
   * ---------------------------------------------------- */

  /* UI Dialog State */
  const DialogDetail = ref(false);
  const DialogUpdate = ref(false);

  /* Table Headers */
  const localHeaderDetailDebt = headerDetailDebt;
  const localHeaderSummaryDebt = headerSummaryDebt;

  /* Form State */
  const debtData = reactive<Partial<Debt>>({});
  const debtUpdateData = reactive<Partial<Debt>>({});

  /* Control Flags */
  const isPay = ref(false);
  const disableAmountPay = ref(false);
  const disableTotal = ref(false);

  /* Error & Alert State */
  const alert = ref(false);
  const showError = ref(false);
  const error = ref<string | string[] | undefined>();

  /* -----------------------------------------------------*
   * COMPUTED Derived state from store & local state      *
   * ---------------------------------------------------- */

  const isSaveDisabled = computed(() => {
    return !(
      debtData.customer_id &&
      debtData.amount_pay &&
      debtData.description
    );
  });

  /* Store State */
  const debts = computed<Debt[]>(() => store.state.debt.debts);
  const summaryDebtData = computed<SummaryDebt[]>(
    () => store.state.debt.summaryDebts
  );
  const outstandingDebtData = computed<SummaryDebt[]>(
    () => store.state.debt.outstandingDebts
  );
  const resetDetailDebt = () => store.dispatch(`debt/${RESET_DETAIL_DEBT}`);

  const loadingDataDetail = computed(() => store.state.debt.loading);
  const loadingData = computed(() => store.state.debt.loadingOne);
  const loadingButtonCreate = computed(
    () => store.state.debt.loadingButtonCreate
  );
  const loadingButtonUpdate = computed(
    () => store.state.debt.loadingButtonUpdate
  );
  const hasSaved = computed(() => store.state.debt.hasSaved);

  /* -----------------------------------------------------*
   * UTILITIES Helper & reusable functions                *
   * ---------------------------------------------------- */

  /**
   * Global error handler
   */
  const handleError = (e: unknown) => {
    showError.value = true;

    if (Array.isArray(e)) error.value = e;
    else if (e instanceof Error) error.value = e.message;
    else error.value = String(e);
  };

  /**
   * Default debt form value
   */
  const defaultDebtData: Partial<Debt> = {
    id: 0,
    customer_id: null,
    customer_name: "",
    description: "",
    amount_pay: 0,
    total: 0,
  };

  /**
   * Reset form data to default state
   */
  const resetDebtData = (data: Partial<Debt>) => {
    Object.assign(data, defaultDebtData);
  };

  /* -----------------------------------------------------*
   * ACTIONS Store dispatch & business logic              *
   * ---------------------------------------------------- */

  const fetchOutstandingDebt = () =>
    store.dispatch(`debt/${LOAD_DATA_OUTSTANDING_DEBT}`);

  const loadSummaryDebt = () =>
    store.dispatch(`debt/${LOAD_DATA_SUMMARY_DEBT}`);

  const loadDetailDebt = () =>
    store.dispatch(`debt/${LOAD_DATA_DEBT}`, debtUpdateData.customer_id);

  const saveDebt = (payload: Partial<Debt>) =>
    store.dispatch(`debt/${CREATE_DEBT}`, payload);

  const updateDebt = () =>
    store.dispatch(`debt/${UPDATE_DEBT}`, debtUpdateData);

  /* -----------------------------------------------------*
   * RETURN Public API of this composable                 *
   * ---------------------------------------------------- */

  return {
    /* State */
    localHeaderDetailDebt,
    localHeaderSummaryDebt,
    debtData,
    debtUpdateData,
    debts,
    summaryDebtData,
    outstandingDebtData,
    headerOutstandingDebt,

    /* UI Flags */
    DialogDetail,
    DialogUpdate,
    loadingData,
    loadingDataDetail,
    loadingButtonCreate,
    loadingButtonUpdate,
    isPay,
    disableAmountPay,
    disableTotal,
    hasSaved,

    /* Error Handling */
    alert,
    error,

    /* Computed */
    isSaveDisabled,

    /* Actions */
    loadSummaryDebt,
    loadDetailDebt,
    // detailDebt,
    resetDebtData,
    saveDebt,
    updateDebt,
    fetchOutstandingDebt,
    resetDetailDebt,
  };
}
