import { LOGIN_ACTION, SIGNUP_ACTION } from "@/store/storeconstant";
import { InitialLoginForm, InitialSignupForm } from "@/types/Auth";
import { computed, reactive, ref } from "vue";
import { useStore } from "vuex";

export function useAuth() {
  /* ----------------------------------------------------
   * CONSTANTS
   * ---------------------------------------------------- */
  const store = useStore();
  const step = ref(1);
  const error = ref<string | string[] | undefined>();
  const showError = ref(false);

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
   * VUEX ACTION WRAPPERS                                 *
   * ---------------------------------------------------- */
  const loading = computed(() => store.state.auth.loading);
  const loadingButtonCreate = computed(() => store.state.auth.loadingButtonCreate);
  const signUp = () => store.dispatch(`auth/${SIGNUP_ACTION}`, signupForm);
  const login = () => store.dispatch(`auth/${LOGIN_ACTION}`, loginForm);

  /* ----------------------------------------------------
   * RETURN
   * ---------------------------------------------------- */
  return {
    // state
    step,
    error,
    showError,

    // computed
    loading,
    loadingButtonCreate,

    // forms
    loginForm,
    signupForm,

    // methods
    login,
    signUp,
  };
}
