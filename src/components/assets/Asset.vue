<template>
    <v-container class="bg-">
      <v-card>
        <v-card-title
           class="text-h5 font-weight-regular bg-blue-darken-1"
        >
        <v-icon>mdi-factory</v-icon>
          Assets
        </v-card-title>
        <v-row no-gutters>
          <v-col order="1">
            <v-text-field 
              class="pa-2 ma-2"
              label="Owner"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="2">
            <v-text-field 
              class="pa-2 ma-2"
              label="Asset Name"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="3">
            <v-text-field 
              class="pa-2 ma-2"
              label="Qty"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="4">
            <v-text-field 
              class="pa-2 ma-2"
              label="Harga Beli"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="5">
            <v-text-field 
              class="pa-2 ma-2"
              label="Harga Jual"
              variant="solo-inverted"
            >
            </v-text-field>
          </v-col>
          <v-col order="6">
            <v-text-field 
              class="pa-2 ma-2"
              label="Description"
              variant="solo-inverted"
              @keyup.enter="loading = !loading;"
            >
            </v-text-field>
          </v-col>
        </v-row>
          <div class="text-center">
            <v-btn
              class="pa-2 ma-2"
               prepend-icon="mdi-check-circle"
              :loading="loading"
              @click="loading = !loading"
              @keyup.enter="loading = !loading;"
            >
              Submit
              <template v-slot:prepend>
                <v-icon color="success"></v-icon>
              </template>
              <template v-slot:loader>
                <v-progress-linear indeterminate></v-progress-linear>
              </template>
            </v-btn>
          </div>
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
            :items="desserts"
            hide-default-footer
          >
            <template v-slot:[`item.number`]="{item, index}">
              <tr>
                <td>{{index + 1}}</td>
                <td>{{item.id}}</td>
              </tr>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon class="me-2" size="small" @click="editItem(item)"> 
                mdi-developer-board
              </v-icon>
            </template>
          </v-data-table>
      </v-card>
    </v-container>
  </template>

<script>
export default {
  data: () => ({
    loading: false,
    headers: [
      { title: 'No', align: 'start', key: 'number'},
      { title: 'Owner', align: 'start', key: 'owner'},
      { title: 'Asset Name', align: 'start', key: 'asset_name' },
      { title: 'Quantity', align: 'center', key: 'qty' },
      { title: 'Buying Price', align: 'center', key: 'buy_price' },
      { title: 'Selling Price', align: 'center', key: 'sell_price' },
      { title: 'Quantity', align: 'center', key: 'qty' },
      { title: 'Action', align: 'end', key: 'actions' },
    ],
    desserts: [
      {
        owner: 'Renan',
        asset_name: 'Gas LPG 3 KG',
        qty: 400,
        buy_price: 145000,
        sell_price: 185000,
        description: 'Ini adalah description',
      },
      {
        owner: 'Aulia',
        asset_name: 'Gas LPG 3 KG',
        qty: 200,
        buy_price: 145000,
        sell_price: 185000,
        description: 'Ini adalah description Aulia',
      },
      {
        owner: 'Rizki Zulfianti',
        asset_name: 'Gas LPG 12 KG',
        qty: 20,
        buy_price: 145000,
        sell_price: 185000,
        description: 'Ini adalah description Rizki',
      },
    ],
  }),

  watch: {
      loading (val) {
        if (!val) return

        setTimeout(() => (this.loading = false), 2000)
      },
    },
}
</script>