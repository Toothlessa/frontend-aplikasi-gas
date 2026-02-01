import { ref, reactive, computed } from "vue";
import store from "@/store/store";
import { LOAD_CURRENT_USER, UPDATE_CURRENT_USER } from "@/store/storeconstant";
import { User } from "@/types";

export function useUser() {

  /* -----------------------------------------------------*
   * STATE - VARIABLE                                     *
   * ---------------------------------------------------- */

  const isEditing = ref(false);
  const userData = reactive<Partial<User>>({});

  /* -----------------------------------------------------*
  * STATE - COMPUTED                                     *
  * ---------------------------------------------------- */
  const hasSaved = computed(() => store.state.user.hasSaved);
  const loadingButtonUpdate = computed(() => store.state.user.loadingButtonUpdate);
  const user = computed(() => store.state.user.currentUser);

  /* -----------------------------------------------------*
  * ACTIONS                                              *
  * ---------------------------------------------------- */
  const loadUser = () => store.dispatch(`user/${LOAD_CURRENT_USER}`);
  const updateUser = () => store.dispatch(`user/${UPDATE_CURRENT_USER}`, userData);

  /* -----------------------------------------------------*
  * RETURN EXPORT                                         *
  * ------------------------------------------------------*/

  return {
    // State
    hasSaved,
    loadingButtonUpdate,
    isEditing,
    userData,

    // Computed
    user,

    // Actions
    loadUser,
    updateUser,
  };
}
