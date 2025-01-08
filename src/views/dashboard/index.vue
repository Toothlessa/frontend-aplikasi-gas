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

          <v-row class="px-5 mt-n6 ml-5" style="height: 250px">
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
                  absolute
                  color="#2EBFAF"
                  class="text-white"
                  fab
                  left
                  top
                >
                  <h2>{{ list.count }}</h2>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
          <v-row >
            <v-col cols="12" sm="7">
             <TopBuyer />
            </v-col>
            <v-col cols="12" sm="5">
              <SalesData />
            </v-col>
          </v-row>
          <v-row class="mt-n12">
            <v-col cols="12" sm="12">
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import SalesData from "@/components/chart/SalesData";
import TopBuyer from "@/components/chart/TopBuyer";
export default {
  name: "Dashboard",
  data: () => ({
   
    lists: [
      {
        icon: "fas fa-user-md",
        title: "Running Stock",
        count: 21,
      },
      {
        icon: "fas fa-procedures",
        title: "Yesterday Stock",
        count: 41,
      },
      {
        icon: "fas fa-user-nurse",
        title: "Empty Gas Stock",
        count: 35,
      },
      {
        icon: "fas fa-hospital",
        title: "Gas Owned",
        count: 578,
      },
    ],
  }),

  components: {
    SalesData,
    TopBuyer,
  },
};
</script>
<style scoped>
.border {
  border: 2px solid #2ebfaf !important;
}
.v-btn--fab.v-size--default.v-btn--absolute.v-btn--top {
  top: 65px !important;
}
.v-btn--absolute.v-btn--left,
.v-btn--fixed.v-btn--left {
  left: -26px !important;
}
</style>