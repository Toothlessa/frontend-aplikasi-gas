import { computed, ref } from "vue";
import { useGlobal } from "./useGlobal";

export function useNavigation() {

  const {
    router,
    store,
    theme,

    search,
  } = useGlobal();

  /* ----------------------------------------------------*
   * CONSTANTS                                           *
   * ----------------------------------------------------*/
  // UI state
  const DialogLogout = ref<boolean>(false);

  const isDarkTheme = ref<boolean>(theme.global.current.value.dark);
  const savedTheme = localStorage.getItem('theme');

  const rail = ref(false);
  const drawer = ref<boolean>(false);

  type DrawerLocation = "left" | "right" | "start" | "end" | "top" | "bottom";
  const savedLocation = localStorage.getItem('drawerLocation') as DrawerLocation | null;
  const drawerLocation = ref<DrawerLocation>(savedLocation ?? "left");

  /* ----------------------------------------------------*
   * LOCAL FUNCTIONS                                     *
   * ----------------------------------------------------*/
  const pages = [
    { icon: 'mdi-basket-fill', text: 'Stock', to: '/stock' },
    { icon: 'mdi-cash', text: 'Debt', to: '/debt' },
    { icon: 'mdi-account-group', text: 'User', to: '/users' },
  ];

  const masterPageChild = [
    ['mdi-car', 'Asset', '/asset'],
    ['mdi-account-tie', 'Customer', '/customer'],
    ['mdi-package-variant', 'Item', '/masteritem'],
  ];

  const toggleDrawerLocation = () => {
    drawerLocation.value = drawerLocation.value === 'left' ? 'right' : 'left';
    localStorage.setItem('drawerLocation', drawerLocation.value);
  };

  const appBarStyles = computed(() => {
    return {
      borderRadius: '24px',
      top: '12px',
    };
  });

  // const logout = () => store.dispatch(`auth/${LOGOUT_ACTION}`);

  // ================================================================
  // 📌 RETURN EXPORT
  // ================================================================
  return {
    DialogLogout,

    theme,
    isDarkTheme,
    savedTheme,

    pages,
    masterPageChild,

    router,
    store,

    search,
    drawer,
    rail,
    drawerLocation,

    appBarStyles,

    toggleDrawerLocation,
    // logout,
  };

}
