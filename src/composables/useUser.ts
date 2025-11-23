import { ref, reactive, computed } from "vue";
import store from "@/store/store";
import { LOAD_CURRENT_USER, UPDATE_CURRENT_USER } from "@/store/storeconstant";
import { User } from "@/types";

export function useUser() {

  // ================================================================
  // 📌 STATE (ref, reactive)
  // ================================================================


  // const hasSaved = ref(false);
  const alert = ref(false);
  const isEditing = ref(false);
  const userData = reactive<Partial<User>>({});

  // Error State
  const showError = ref(false);
  const error = ref<string | string[] | undefined>();

  // ================================================================
  // 📌 COMPUTED
  // ================================================================

  const user = computed(() => store.state.user.currentUser);
  const hasSaved = computed(() => store.state.user.hasSaved);
  const loadingButtonUpdate = computed(() => store.state.user.loadingButtonUpdate);

  // ================================================================
  // 📌 UTILITIES
  // ================================================================

  const handleError = (e: unknown) => {
    showError.value = true;

    if (Array.isArray(e)) error.value = e;
    else if (e instanceof Error) error.value = e.message;
    else error.value = String(e);
  };

  // ================================================================
  // 📌 ACTIONS
  // ================================================================

  const userLoad = async () => {
    
      console.log('User Data: ', user.value?.username);
    try {
      await store.dispatch(`user/${LOAD_CURRENT_USER}`);

      userData.username = user.value?.username;
      userData.email = user.value?.email;
    } catch (error) {
      handleError(error);
      alert.value = true;
    }
  };

  const onUpdate = async () => {
    try {
      await store.dispatch(`user/${UPDATE_CURRENT_USER}`, userData);
      isEditing.value = false;
    } catch (error) {
      handleError(error);
      alert.value = true;
    }
  };

  // ================================================================
  // 📌 RETURN EXPORT
  // ================================================================

  return {
    // State
    hasSaved,
    loadingButtonUpdate,
    alert,
    isEditing,
    userData,

    // UI
    // save,

    // Error Handling
    showError,
    error,

    // Computed
    user,

    // Utilities
    handleError,

    // Actions
    userLoad,
    onUpdate,
  };
}
