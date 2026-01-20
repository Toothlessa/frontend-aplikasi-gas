import { computed, handleError, reactive, ref } from "vue";

import router from "@/router";
import store from "@/store/store";

import {
  CREATE_ASSET,
  CREATE_OWNER,
  LOAD_ASSET,
  LOAD_ASSET_DETAILS_BY_SUMMARY,
  LOAD_OWNER,
  RESET_DETAIL_ASSET,
} from "@/store/storeconstant";
import { Asset, headerAsset, headerAssetDetail, Owner } from "@/types";

export function useAsset() {
  /* -----------------------------------------------------*
   * REACTIVE OBJECTS                                     *
   * ---------------------------------------------------- */
  const dialogOwner = ref(false);
  const searchQuery = ref("");
  const isEdit = ref(false);

  const isNavigatingBack = ref(false);
  const loadingDetailKey = ref<string | null>(null);

  const assetData = reactive<Partial<Asset>>({});
  const newOwnerData = ref<Partial<Owner>>({});

  const createDefaultAsset = (): Asset => ({
    id: 0,
    owner_id: 0,
    item_id: 0,
    owner_name: '',
    item_name: '',
    quantity: 0,
    cogs: 0,
    selling_price: 0,
    description: '',
    created_at: '',
    created_by: '',
  });

  const assetToUpdate = reactive<Asset>(createDefaultAsset());

  /* -----------------------------------------------------*
   * FORM HELPERS                                         *
   * ---------------------------------------------------- */
  const resetAssetForm = () => {
    Object.assign(assetData, {
      asset_name: "",
      owner_id: "",
      quantity: 0,
      cogs: 0,
      selling_price: 0,
      description: "",
    });
  };

  /* -----------------------------------------------------*
   * NAVIGATION & EVENT HANDLERS                           *
   * ---------------------------------------------------- */
  const goToAssetDetails = (owner_id: number, item_id: number) => {
    resetAssetDetail();
    loadingDetailKey.value = `${owner_id}-${item_id}`;
    setTimeout(() => {
      router.push({
        name: 'AssetDetails',
        params: {
          owner_id,
          item_id
        },
      });
    }, 300);
  };

  const goBack = () => {
    isNavigatingBack.value = true;
    setTimeout(() => {
      router.back();
    }, 300);
  };

  const onUpdateOwner = (item: Owner) => {
    newOwnerData.value = { ...item };
  };

  /* -----------------------------------------------------*
   * COMPUTED PROPERTIES                                  *
   * ---------------------------------------------------- */
  const assetOwners = computed<Owner[]>(() => store.state.asset.owners);
  const assets = computed<Asset[]>(() => store.state.asset.assets);
  const assetDetails = computed(() => store.state.asset.assetDetails);
  const resetAssetDetail = () => store.dispatch(`asset/${RESET_DETAIL_ASSET}`);

  const hasSaved = computed(() => store.state.asset.hasSaved);
  const loading = computed(() => store.state.asset.loading);
  const loadingOwner = computed(() => store.state.asset.loadingOwner);
  const loadingButtonCreate = computed(() => store.state.asset.loadingButtonCreate);

  /* -----------------------------------------------------*
   * VUEX ACTION WRAPPERS                                 *
   * ---------------------------------------------------- */
  const loadAssets = () => store.dispatch(`asset/${LOAD_ASSET}`);
  const loadOwners = () => store.dispatch(`asset/${LOAD_OWNER}`);
  const loadAssetDetail = (owner_id: number, item_id: number) => {
    return store.dispatch(`asset/${LOAD_ASSET_DETAILS_BY_SUMMARY}`, {
      owner_id,
      item_id,
    });
  };

  const createAsset = (asset: Partial<Asset>) => store.dispatch(`asset/${CREATE_ASSET}`, asset);
  const createOwner = (ownerData: Partial<Owner>) => store.dispatch(`asset/${CREATE_OWNER}`, ownerData);

  /* -----------------------------------------------------*
   * EXPOSED API                                          *
   * ---------------------------------------------------- */
  return {
    dialogOwner,
    searchQuery,

    headerAsset,
    headerAssetDetail,

    newOwnerData,
    isEdit,

    loadingDetailKey,
    isNavigatingBack,
    goBack,

    assetData,
    assetToUpdate,
    assetOwners,
    assets,
    assetDetails,

    hasSaved,
    loading,
    loadingOwner,
    loadingButtonCreate,

    // handleError,

    createAsset,
    createOwner,

    loadAssets,
    loadOwners,
    loadAssetDetail,

    resetAssetForm,
    goToAssetDetails,
    onUpdateOwner,

    resetAssetDetail,
  };
}