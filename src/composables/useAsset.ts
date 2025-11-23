import router from "@/router";
import store from "@/store/store";
import { CREATE_ASSET, CREATE_OWNER, LOAD_ASSET, LOAD_OWNER } from "@/store/storeconstant";
import { Asset, headerAsset, Owner } from "@/types";
import { computed, reactive, ref } from "vue";

export function useAsset() {

    const openDialogOwner = ref(false);

    const searchQuery = ref('');
    const isCreatingAsset = ref(false);

    const assetHeader = headerAsset;

    const assetData = reactive<Partial<Asset>>({});
    const newOwnerData = ref<Partial<Owner>>({});
    const isEdit = ref(false);

    const snackbar = reactive({
        show: false,
        message: '',
        color: '',
    });
    const showSnackbar = (message: string, color: string) => {
        snackbar.message = message;
        snackbar.color = color;
        snackbar.show = true;
    };
    const resetAssetForm = () => {
        Object.assign(assetData, {
            asset_name: '',
            owner_id: '',
            quantity: 0,
            cogs: 0,
            selling_price: 0,
            description: '',
        });
    };
    const goToAssetDetails = (ownerId: number, itemId: number) => {
        router.push({ name: 'AssetDetails', params: { ownerId, itemId } });
    };
    const onUpdateOwner = (item: Owner) => {
        newOwnerData.value = { ...item }; // Set item to pass to the dialog
    };

    
    // --- Computed Properties ---
    const assetOwners = computed<Owner[]>(() => store.state.asset.owners);
    const assets = computed<Asset[]>(() => store.state.asset.assets);

    const loadAssets = () => store.dispatch(`asset/${LOAD_ASSET}`);
    const loadOwners = () => store.dispatch(`asset/${LOAD_OWNER}`);
    const loading = computed(() => store.state.asset.loading);

    const createAsset = async () => {
        try {
            isCreatingAsset.value = true;
            await store.dispatch(`asset/${CREATE_ASSET}`, assetData);
            showSnackbar('Asset created successfully!', 'success');
            resetAssetForm();
        } catch (error) {
            showSnackbar('Failed to create asset.', 'error');
        } finally {
            isCreatingAsset.value = false;
        }
    };

    const createOwner = async (ownerData: Partial<Owner>) => {
        try {
            await store.dispatch(`asset/${CREATE_OWNER}`, ownerData);
            showSnackbar('Owner created successfully!', 'success');
            openDialogOwner.value = false;
        } catch (error) {
            showSnackbar('Failed to create owner.', 'error');
        }
    };

    return {
        openDialogOwner,

        searchQuery,
        isCreatingAsset,

        // table
        assetHeader,

        assetData,
        newOwnerData,
        isEdit,

        snackbar,
        showSnackbar,

        // computed properties
        assetOwners,
        assets,
        loadAssets,
        loadOwners,
        loading,

        //call vuex
        createAsset,
        createOwner,

        resetAssetForm,
        goToAssetDetails,
        onUpdateOwner,
    };
}