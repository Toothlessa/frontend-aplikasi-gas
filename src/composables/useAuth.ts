import { LOGIN_ACTION, LOGOUT_ACTION, SIGNUP_ACTION } from "@/store/storeconstant";
import { InitialLoginForm, InitialSignupForm } from "@/types/Auth";
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";

export function useAuth() {
  /* ----------------------------------------------------*
   * CONSTANTS                                           *
   * ----------------------------------------------------*/
  const store = useStore();
  const step = ref(1);

  const loginForm = reactive<InitialLoginForm>({
    email: '',
    password: '',
  });
  const signupForm = reactive<InitialSignupForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  /* -----------------------------------------------------*
   * COMPUTED PROPERTIES                                  *
   * ---------------------------------------------------- */
  const loading = computed(() => store.state.auth.loading);
  const loadingButtonCreate = computed(() => store.state.auth.loadingButtonCreate);

  /* -----------------------------------------------------*
   * VUEX API's                                           *
   * ---------------------------------------------------- */
  const signUp = () => store.dispatch(`auth/${SIGNUP_ACTION}`, signupForm);
  const login = () => store.dispatch(`auth/${LOGIN_ACTION}`, loginForm);
  const logout = () => store.dispatch(`auth/${LOGOUT_ACTION}`);

  /* ----------------------------------------------------
   * RETURN
   * ---------------------------------------------------- */
  return {
    // state
    step,
    // computed
    loading,
    loadingButtonCreate,

    // forms
    loginForm,
    signupForm,

    // methods
    login,
    signUp,
    logout,
  };
}
