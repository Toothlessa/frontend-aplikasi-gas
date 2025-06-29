<template>
    <v-container class="bg-">
      <v-card>
        <v-card-title
           class="text-h5 font-weight-regular bg-blue-darken-1"
        >
        <v-row no-gutters>
        <v-icon>mdi-google-earth</v-icon>&nbsp; Assets
          <v-spacer></v-spacer>
          <v-btn
            class="pa-2 ma-2 text-center bg-orange-lighten-4"
            prepend-icon="mdi-account-plus"
            @click="DialogOpenOwner=true"
          >
          Owner
          </v-btn>
          <v-snackbar
            class="text-center"
            v-model="hasSaved"
            :timeout="1000"
            location="top center"
          >
          Data telah tesimpan
          </v-snackbar>
        </v-row>
        </v-card-title>
        <v-row no-gutters>
          <v-col order="1">
            <v-autocomplete 
              class="pa-2 ma-2"
              label="Owner"
              v-model="assets.owner_id"
              variant="solo-inverted"
              :items="assetOwners"
              item-title="name"
              item-value="id"
            >
            </v-autocomplete>
          </v-col>
          <v-col order="2">
            <v-autocomplete
              class="pa-2 ma-2"
              label="Asset Name"
              v-model="assets.item_name"
              variant="solo-inverted"
              :items="assets"
              item-title="item_name"
            >
            </v-autocomplete>
          </v-col>
          <v-col order="3">
            <v-text-field 
              class="pa-2 ma-2"
              label="Qty"
              v-model="assets.quantity"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="4">
            <v-text-field 
              class="pa-2 ma-2"
              label="Harga Beli"
              v-model="assets.cogs"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="5">
            <v-text-field 
              class="pa-2 ma-2"
              label="Harga Jual"
              v-model="assets.selling_price"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="6">
            <v-text-field 
              class="pa-2 ma-2"
              label="Description"
              v-model="assets.description"
              variant="solo-inverted"
              @keyup.enter="createAsset();loading = !loading"
            >
            </v-text-field>
          </v-col>
        </v-row>
          <v-col class="text-center">
            <v-btn
              class="pa-2 ma-2 text-center bg-blue-darken-1"
              prepend-icon="mdi-check-circle"
              :loading="loading"
              @click="createAsset()"
            >
              Submit
              <template v-slot:prepend>
                <v-icon color="success"></v-icon>
              </template>
              <template v-slot:loader>
                <v-progress-linear indeterminate></v-progress-linear>
              </template>
            </v-btn>
          </v-col>
      </v-card>
      <v-divider></v-divider>
      <v-card>
        <v-card-title
           class="text-h5 font-weight-regular bg-blue-lighten-1"
        >
        <v-icon>mdi-format-list-bulleted-type</v-icon>
          List of Asset
        </v-card-title>
          <v-data-table
            :headers="headers"
            :items="assetSummary"
            hide-default-footer
          >
            <template v-slot:[`item.number`]="{item, index}">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{item.id}}</td>
              </tr>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon class="me-2" size="small" @click="detailAsset(item)"> 
                mdi-developer-board
              </v-icon>
            </template>
          </v-data-table>
      </v-card>
      <v-dialog
        v-model="DialogOpenOwner"
        transition="dialog-bottom-transition"
        width="auto"
      >
        <v-card
          class="elevation-12"
          variant="elevated"
        > 
          <v-card-title class="text-h6 font-weight-regular bg-blue-darken-1">
            <v-icon size="30" >mdi-account-circle</v-icon>&nbsp; Owners
          </v-card-title>
            <v-text-field 
              class="pa-2 ma-2"
              label="Owner Name"
              variant="solo-inverted"
            >
            </v-text-field>
            <div class="text-center">
              <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-copyright"
                text="Create"
                variant="outlined"
              >
              </v-btn>
              <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-close-circle-outline"
                text="Close"
                variant="outlined"
                @click="DialogOpenOwner=false"
              >
              </v-btn>
            </div>
            <v-divider></v-divider>
              <v-col>
                <v-data-table
                >
                </v-data-table>
              </v-col>
        </v-card>
      </v-dialog>
      <!-- Dialog Update Owner -->
      <v-dialog
        v-model="dialogUpdateOwner"
        transition="dialog-bottom-transition"
        width="auto"
      >
      <v-card
          class="elevation-12"
          variant="elevated"
        > 
          <v-card-title class="text-h6 font-weight-regular bg-blue-darken-1">
            <v-icon size="30" >mdi-sync</v-icon>&nbsp; Update Owner
            <v-alert 
              class="text-red"
              v-model="alert"
              border="start"
              variant="tonal"
              closable
              v-if="error"
            > 
              {{ error }} 
            </v-alert>
          </v-card-title>
          <v-text-field 
              class="pa-2 ma-2"
              v-model="updateOwners.name"
              label="Owner Name"
              variant="solo-inverted"
              @keyup.enter="updateOwner"
            >
            </v-text-field>
            <div class="text-center">
              <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-update"
                text="Update"
                variant="outlined"
                @click="updateOwner"
              >
              </v-btn>
            </div>
        </v-card>
      </v-dialog>
      <!-- Dialog Inactive Owner -->
      <v-dialog v-model="dialogInactive" max-width="500px">
          <v-card
            class="elevation-12"
            variant="elevated"
          >
            <v-card-title 
              class="bg-blue-darken-2 text-h5"
            >Change the status of Owner?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue-darken-2" 
                variant="text" 
                @click="dialogInactive=false"
              >
              <v-icon size="30">mdi-cancel</v-icon>
              </v-btn
              >
              <v-btn
                color="blue-darken-2"
                variant="text"
                @click="inactiveOwner"
              >
              <v-icon size="30">mdi-check</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <!-- Dialog Detail Assets -->
      <v-dialog
        v-model="dialogDetailAsset"
        transition="dialog-bottom-transition"
        width="auto"
      >
      <v-card
          class="elevation-12"
          variant="elevated"
        > 
          <v-card-title class="text-h6 font-weight-regular bg-blue-darken-1">
            <v-icon size="30" >mdi-details</v-icon>&nbsp; Detail Asset
            <v-alert 
              class="text-red"
              v-model="alert"
              border="start"
              variant="tonal"
              closable
              v-if="error"
            > 
              {{ error }} 
            </v-alert>
          </v-card-title>
            <v-data-table
              :headers="detailHeaders"
              :items="getDetailAssets"
              hide-default-footer
            >
              <template v-slot:[`item.number`]="{index}">
                <tr>
                  <td>{{index + 1}}</td>
                </tr>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-icon class="me-2" size="small" @click="updateAsset(item)"> 
                  mdi-update
                </v-icon>
              </template>
            </v-data-table>
        </v-card>
      </v-dialog>
      <!-- Dialog Update Asset -->
      <v-dialog
        v-model="dialogUpdateAsset"
        transition="dialog-bottom-transition"
        width="auto"
      >
      <v-card
          class="elevation-12"
          variant="elevated"
        > 
          <v-card-title class="text-h6 font-weight-regular bg-blue-darken-1">
            <v-icon size="30" >mdi-sync</v-icon>&nbsp; Update Owner
            <v-alert 
              class="text-red"
              v-model="alert"
              border="start"
              variant="tonal"
              closable
              v-if="error"
            > 
              {{ error }} 
            </v-alert>
          </v-card-title>
          <v-card-item>
            <v-divider class="mt-1"></v-divider>
            <v-autocomplete 
              label="Owner"
              v-model="updateOwnerAsset"
              variant="outlined"
              :items="assetOwners"
              item-title="name"
              item-value="id"
            >
            </v-autocomplete>
            <v-text-field
              label="Asset Name"
              v-model="updateAssets.asset_name"
              variant="outlined"
            >
            </v-text-field>
            <v-text-field
              label="Quantity"
              v-model="updateAssets.quantity"
              variant="outlined"
            >
            </v-text-field>
            <v-text-field
              label="Cost of Goods"
              v-model="updateAssets.cogs"
              variant="outlined"
            >
            </v-text-field>
            <v-text-field
              label="Selling Price"
              v-model="updateAssets.selling_price"
              variant="outlined"
            >
            </v-text-field>
            <v-textarea
              label="Description"
              v-model="updateAssets.description"
              variant="outlined"       
              color="blue-grey"
              @keyup.enter="updateDetailAsset()"
            >
            </v-textarea>
          </v-card-item>
            <div class="text-center">
              <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-update"
                text="Update"
                variant="outlined"
                @click="updateDetailAsset"
              >
              </v-btn>
            </div>
        </v-card>
      </v-dialog>
    </v-container>
  </template>

<script setup lang="ts">

import { Asset, AssetField } from '@/types/asset';

import store from '@/store/store';
import { computed, onMounted, reactive, ref } from 'vue';
import { 
  LOAD_ASSET,
  LOAD_OWNER
} from '@/store/storeconstant';


const DialogOpenOwner = ref<boolean>(false);

const loadAssetData = () => store.dispatch(`asset/${LOAD_ASSET}`);
const loadOwnerData = () => store.dispatch(`asset/${LOAD_OWNER}`);

onMounted(() => {
  loadAssetData();
  loadOwnerData();
});

//computed
const assets = computed<Asset[]>(() => store.state.asset.assets);
const owners = computed<Asset[]>(() => store.state.asset.owners);

</script>