import { ref } from "vue";

export function useDashboard() {
  /* -------------------------------------------------------*
   * 📌 CONSTANT                                           *
   * -------------------------------------------------------*/
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

  /* ----------------------------------------------------
   * 📌 RETURN EXPORT
   * ---------------------------------------------------- */
  return {
    lists,
  };
}
