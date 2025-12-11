import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex/types/index.js";

export function useLogin() {
  /* ----------------------------------------------------
   * RETURN API
   * ---------------------------------------------------- */

  const store = useStore();
  const router = useRouter();

  const step = ref(1);

  const error = ref('');

  const loginForm = reactive<Partial<InitialLoginForm>>({});
  const signupForm = reactive<Partial<InitialSignUpForm>>({});
  return {

  };
}  
