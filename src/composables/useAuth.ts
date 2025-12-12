import { LOGIN_ACTION, SIGNUP_ACTION } from "@/store/storeconstant";
import { InitialLoginForm, InitialSignupForm } from "@/types/Auth";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export function useAuth() {
  /* ----------------------------------------------------
   * STORE & ROUTER
   * ---------------------------------------------------- */
  const store = useStore();
  const router = useRouter();

  /* ----------------------------------------------------
   * STATE
   * ---------------------------------------------------- */
  const step = ref(1);
  const error = ref<string | string[] | undefined>();
  const showError = ref(false);

  /* ----------------------------------------------------
   * FORMS
   * ---------------------------------------------------- */
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

  /* ----------------------------------------------------
   * ERROR HANDLER
   * ---------------------------------------------------- */
  const handleError = (e: unknown) => {
    showError.value = true;

    if (Array.isArray(e)) {
      error.value = e;
    } else if (e instanceof Error) {
      error.value = e.message;
    } else {
      error.value = String(e);
    }
  };

  /* ----------------------------------------------------
   * COMPUTED
   * ---------------------------------------------------- */
  const loading = computed(() => store.state.auth.loading);
  const loadingButtonCreate = computed(() => store.state.auth.loadingButtonCreate);

  /* ----------------------------------------------------
   * METHODS
   * ---------------------------------------------------- */

  // SIGNUP
  const signUp = async () => {
    // simple validation
    if (signupForm.password !== signupForm.confirmPassword) {
      error.value = "Passwords do not match";
      showError.value = true;
      return;
    }

    error.value = "";
    showError.value = false;

    try {
      await store.dispatch(`auth/${SIGNUP_ACTION}`, signupForm);
      router.push("/");
    } catch (err) {
      handleError(err);
    }
  };

  // LOGIN
  const login = async () => {
    error.value = "";
    showError.value = false;

    try {
      await store.dispatch(`auth/${LOGIN_ACTION}`, loginForm);
      router.push("/");
    } catch (err) {
      handleError(err);
    }
  };

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
