import { ref } from "vue";
import { useStock } from "./useStock";

export function useDashboard() {

  const{
    stockDisplay,
  } = useStock();

  // ================================================================
  // 📌 STATE (ref, reactive)
  // ================================================================
  const lists = ref([
  {
    icon: "mdi-gas-cylinder",
    title: "Running Stock",
    count: 0,
  },
  {
    icon: "mdi-calendar-check",
    title: "Yesterday Stock",
    count: 0,
  },
  {
    icon: "mdi-gas-station-off",
    title: "Empty Gas",
    count: 0,
  },
  {
    icon: "mdi-account-hard-hat",
    title: "Owned Gas",
    count: 0,
  },
]);

  // ================================================================
  // 📌 COMPUTED
  // ================================================================

  // ================================================================
  // 📌 UTILITIES
  // ================================================================
 
  // ================================================================
  // 📌 ACTIONS
  // ================================================================
    const fetchDataDisplayStock = async () => {
      lists.value[0].count = stockDisplay.value?.running_stock ?? 0;
      lists.value[1].count = stockDisplay.value?.yesterday_stock ?? 0;
      lists.value[2].count = stockDisplay.value?.empty_gas ?? 0;
      lists.value[3].count = stockDisplay.value?.gas_owned ?? 0;
    };

  // ================================================================
  // 📌 RETURN EXPORT
  // ================================================================
  return {
    lists,
    fetchDataDisplayStock,
  };
}
