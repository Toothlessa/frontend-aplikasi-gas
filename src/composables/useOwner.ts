import store from "@/store/store";
import { CREATE_OWNER, DEACTIVE_OWNER, LOAD_OWNER } from "@/store/storeconstant";
import { Owner } from "@/types";
import { computed } from "vue";

export function useOwner() {

    /*-----------------------------------------------------*
    * COMPUTED PROPERTIES                                  *
    * ---------------------------------------------------- */
    const loadingOwner = computed(() => store.state.asset.loading);
    const loadingButtonOwner = computed(() => store.state.asset.loadingOwner);
    const assetOwners = computed<Owner[]>(() => store.state.asset.owners);

    /*-----------------------------------------------------*
    * VUEX ACTION                                          *
    * ---------------------------------------------------- */
    const loadOwners = () => store.dispatch(`asset/${LOAD_OWNER}`);
    const createOwner = (ownerData: Partial<Owner>) => store.dispatch(`asset/${CREATE_OWNER}`, ownerData);
    const updateOwner = (ownerData: Owner) => store.dispatch(`asset/${CREATE_OWNER}`, ownerData);
    const deactivateOwner = (owner_id: number) => store.dispatch(`asset/${DEACTIVE_OWNER}`, owner_id);

    return {
        loadingOwner,
        loadingButtonOwner,

        assetOwners,
        loadOwners,
        createOwner,
        updateOwner,
        deactivateOwner,
    }
}