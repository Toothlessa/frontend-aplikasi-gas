import { ref, reactive, computed } from "vue";
import store from "@/store/store";
import { CREATE_DEBT,  LOAD_DATA_DEBT, LOAD_DATA_SUMMARY_DEBT, UPDATE_DEBT } from "@/store/storeconstant";
import { Debt, headerDetailDebt, headerSummaryDebt, SummaryDebt } from "@/types";

export function useDebt() {

  // ================================================================
  // 📌 STATE (ref, reactive)
  // ================================================================

  // UI States
  const DialogDetail = ref(false);
  const DialogUpdate = ref(false);

  // UI Table Headers
  const localHeaderDetailDebt = headerDetailDebt;
  const localHeaderSummaryDebt = headerSummaryDebt;

  // Debt Forms
  const debtData = reactive<Partial<Debt>>({});
  const debtUpdateData = reactive<Partial<Debt>>({});

  // Control Logic States
  const isPay = ref(false);
  const disableAmountPay = ref(false);
  const disableTotal = ref(false);

  // Error Handling
  const alert = ref(false);
  // Error State
  const showError = ref(false);
  const error = ref<string | string[] | undefined>();


  // ================================================================
  // 📌 COMPUTED
  // ================================================================
  const isSaveDisabled = computed(() => {
    return !(
      debtData.customer_id &&
      debtData.amount_pay &&
      debtData.description
    );
  });

  const debts = computed<Debt[]>(() => store.state.debt.debts);
  const summaryDebtData = computed<SummaryDebt[]>(() => store.state.debt.summaryDebts);
  const loadingDataDetail = computed(() => store.state.debt.loading);
  const loadingData = computed(() => store.state.debt.loadingOne);
  const loadingButtonCreate = computed(() => store.state.debt.loadingButtonCreate);
  const loadingButtonUpdate = computed(() => store.state.debt.loadingButtonUpdate);
  const hasSaved = computed(() => store.state.debt.hasSaved);


  // ================================================================
  // 📌 UTILITIES
  // ================================================================
  const handleError = (e: unknown) => {
    showError.value = true;

    if (Array.isArray(e)) error.value = e;
    else if (e instanceof Error) error.value = e.message;
    else error.value = String(e);
  };

  const defaultDebtData: Partial<Debt> = {
    id: 0,
    customer_id: null,
    customer_name: '',
    description: '',
    amount_pay: 0,
    total: 0,
  }

  const resetDebtData = (data: any) => {
    Object.assign(data, defaultDebtData);
  };
  // ================================================================
  // 📌 ACTIONS
  // ================================================================
  const detailDebt = async (item: any) => {
    Object.assign(debtUpdateData, item);
    error.value = '';
    try{
      await store.dispatch(`debt/${LOAD_DATA_DEBT}`, debtUpdateData.customer_id);

      DialogDetail.value = true;
    } catch(error){
      handleError(error);
      alert.value = true;
    }
  };

  const debtSummaryLoad = async () => {
    try{
      await store.dispatch(`debt/${LOAD_DATA_SUMMARY_DEBT}`);
      console.log('Debt Summary: ', debts);
    }catch(error){
      handleError(error);
      alert.value = true;
    }
  };

  const saveDebt = async () => {
    const payload = { ...debtData }; 

    if(isPay.value) {
      payload.total = 0;    
    }else{
      payload.total = payload.amount_pay;  
      payload.amount_pay = 0;
    }
    try {
      await store.dispatch(`debt/${CREATE_DEBT}`, payload);
      //reset form
      resetDebtData(debtData);          
      isPay.value = false;
    }catch(error){
      handleError(error);
      alert.value = true;
    }               
  };

  const editDebt = (item: any) => {
    Object.assign(debtUpdateData, item);

    // Parse currency to number
    const parsedAmountPay = parseFloat(
      String(item.amount_pay).replace(/[^0-9,-]+/g, "").replace(",", ".")
    );
    const parsedTotal = parseFloat(
      String(item.total).replace(/[^0-9,-]+/g, "").replace(",", ".")
    );

    debtUpdateData.amount_pay = isNaN(parsedAmountPay) ? 0 : parsedAmountPay;
    debtUpdateData.total = isNaN(parsedTotal) ? 0 : parsedTotal;

    disableAmountPay.value = !!debtUpdateData.amount_pay;
    disableTotal.value = !!debtUpdateData.total;

    DialogUpdate.value = true;
  };

  const updateDebt = async () => {
    try{
      await store.dispatch(`debt/${UPDATE_DEBT}`, debtUpdateData);
      await store.dispatch(`debt/${LOAD_DATA_DEBT}`, debtUpdateData.customer_id);
      setTimeout(()=> {
        DialogUpdate.value = false;
        resetDebtData(debtUpdateData);   
      }, 1000); 
    }catch(error){
      handleError(error);
      alert.value = true;
    }
  };

  // ================================================================
  // 📌 RETURN EXPORT
  // ================================================================
  return {
    // State
    localHeaderDetailDebt,
    localHeaderSummaryDebt,
    debtData,
    debtUpdateData,
    debts,
    summaryDebtData,

    // UI Flags
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

    // Error Handling
    alert,
    error,

    // Computed & Utils
    isSaveDisabled,

    // API & Actions
    debtSummaryLoad,
    detailDebt,
    saveDebt,
    editDebt,
    updateDebt,
  };
}
