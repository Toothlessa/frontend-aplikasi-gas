import store from "@/store/store";
import { DEACTIVE_OWNER } from "@/store/storeconstant";
import { Owner } from "@/types";
import { reactive, ref } from "vue";

export function useOwner(props: any, emit: any) {

    const dialogDeactivate = ref(false);
    const localDialog = ref(props.dialog);

    const selectedItem = ref<Owner | null>(null);
    const localOwner = reactive<Partial<Owner>>({});

    const defaultOwner: Partial<Owner> = {
        id: 0,
        name: '',
        active_flag: true,
        inactive_date: '',
    };

    const closeDialog = () => emit('close')
    const submitOwner = (item: Partial<Owner>) => emit('submit', item)

    const handleClose = () => {
        emit('close');
        Object.assign(localOwner, defaultOwner);
    };

    const handleSave = () => {
        emit('submit', localOwner);
        handleClose();
    };

    const openDeactivateDialog = (item: Owner) => {
        selectedItem.value = item;
        dialogDeactivate.value = true;
        console.log(selectedItem.value);
    };

    const onDeactivateConfirm = async () => {
        console.log('Start onDeactivate Confirm');
        if (selectedItem.value) {
            
            try {
            console.log('execute');
            await store.dispatch(`asset/${DEACTIVE_OWNER}`, selectedItem.value.id);
            dialogDeactivate.value = false;
            } catch (e) {
            // Handle error, e.g., show a snackbar
            console.error('Deactivation failed:', e);
            }
        }
    };

    return {

        localDialog,
        dialogDeactivate,

        localOwner,
        selectedItem,
        defaultOwner,

        closeDialog, 
        submitOwner,

        handleClose,
        handleSave,

        openDeactivateDialog,
        onDeactivateConfirm,
    }
}