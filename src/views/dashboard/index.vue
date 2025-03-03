<template>
  <v-app
    id="inspire"
    :style="{ background: $vuetify.theme.themes.dark.background }"
  >
    <v-divider color="white" class="mt-1" dark></v-divider>
    <v-container>
      <v-row>
        <v-col cols="12" sm="12">
          <v-toolbar flat color="rgba(0,0,0,0)" class="mt-n5">
            <v-toolbar-title class="text-teal text-lg-h5 font-weight-bold ">Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-row class="px-5 mt-n6 ml-5">
            <v-col cols="12" sm="3" v-for="list in lists" :key="list">
              <v-card
                align="center"
                color="#f0f5ff"
                class="rounded-circle border pt-10"
                width="200"
                height="200"
                flat
              >
                <v-icon size="60" color="#2EBFAF">
                  {{ list.icon }}
                </v-icon>
                <v-card-text class="text-grey text-lg-h6">
                  {{ list.title }}
                </v-card-text>
     
                <v-btn
                  class="text-white"
                  absolute
                  color="#2EBFAF"
                  elevation="8"
                  rounded="lg"
                >
                  <h2>{{ list.count }}</h2>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="12" sm="7">
              <SalesData /> 
            </v-col>
            <v-col cols="12" sm="5">
              <TopBuyer />
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="mt-n12">
            <v-col cols="12" sm="7">
              <TableOutstandingTrx />
            </v-col>
            <v-col cols="12" sm="5">
              <TableDebt />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import SalesData from "@/components/chart/SalesData";
import TableDebt from "@/components/chart/TableDebt.vue";
import TableOutstandingTrx from "@/components/chart/TableOutstandingTrx.vue";
import TopBuyer from "@/components/chart/TopBuyer";
import AxiosInstance from "@/services/AxiosInstance";
import Validations from "@/services/Validations";
import store from "@/store/store";
import { GET_USER_TOKEN_GETTER } from "@/store/storeconstant";
export default {
  name: "Dashboard",
  data: () => ({
    lists: [
      {
        icon: "mdi-run-fast",
        title: "Running Stock",
        count: '',
      },
      {
        icon: "mdi-hamburger",
        title: "Yesterday Stock",
        count: '',
      },
      {
        icon: "mdi-fire",
        title: "Empty Gas",
        count: '',
      },
      {
        icon: "mdi-matrix",
        title: "Owned Gas",
        count: '',
      },
    ],
  }),

  components: {
    SalesData,
    TopBuyer,
    TableOutstandingTrx,
    TableDebt,
  },

  created() {
    this.getDisplayStock();
  },

  methods : {

    async getDisplayStock() {

      try {
          await AxiosInstance.get(`http://127.0.0.1:8000/api/stockitems/displaystock`,
          {
              headers: {
              'Content-Type': 'application/json', 
              'Accept': 'application/json',
              'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
          }
      })
      .then((response) => { 

          if(response.status == 200){

            this.lists[0].count = response.data.running_stock;
            this.lists[1].count = response.data.yesterday_stock;
            this.lists[2].count = response.data.empty_gas;
            this.lists[3].count = response.data.empty_gas_owned;
          }
      });

      } catch(error) {
          this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
          this.alert = true
      }
    },
  }
};
</script>

<style scoped>
.v-btn{
    border-radius:28px!important;
 } 
.border {
  border: 2px solid #2ebfaf !important;
}
.left {
  left: -26px !important;
}
.top{
  top: 65px !important;
}
.v-btn--fab.v-size--default.v-btn--absolute.v-btn--top {
  top: 65px !important;
}
.v-btn--absolute.v-btn--left,
.v-btn--fixed.v-btn--left {
  left: -26px !important;
}
</style>