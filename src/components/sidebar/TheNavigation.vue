<template>
  <nav>
    <v-navigation-drawer 
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
      app 
      dark
      color="teal"
    >
      <v-list-item
        lines="two"
        prepend-icon="mdi-face-profile"
        :title="result.username"
        :subtitle="result.email"
        nav
      >
        <template v-slot:append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>
      <!-- <v-divider class="mx-10 mt-1" ></v-divider> -->
      <v-list dense class="mt-5" >
        <v-list-item-group v-model="selectedItem" color="white" >
          <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-file-document" title="Transaction" to="/transaction"></v-list-item>
          <v-list-group value="Master">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-bind="props"
                  title="Master"
                  prepend-icon="mdi-chart-pie"
                ></v-list-item>
              </template>

              <v-list-item
                v-for="([icon, title, to], i) in masters"
                :key="i"
                :prepend-icon="icon"
                :title="title"
                :value="title"
                :to="to"
              ></v-list-item>
          </v-list-group>
          <v-list-item v-for="(item, i) in items" :key="i" :value="item" :to="item.to"  @click="actionClickNav(item.action)" >
            <template v-slot:prepend>
              <v-icon :icon="item.icon" ></v-icon>
            </template>
            <v-list-item-content>
              <v-list-item-title v-text="item.text" ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
          <div class="pa-2">
            <v-list-item prepend-icon="mdi-logout" title="Logout" @click.prevent="actionClickNav('logout')"></v-list-item>
          </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app  color="teal-lighten-5" flat>
      <v-text-field  dense label="Search..." color="black"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn class="ml-2"  icon  small>
        <v-icon color='grey'> mdi-bell </v-icon>
      </v-btn>
      <v-btn class="ml-2" icon  small>
        <v-icon color='grey'> mdi-email </v-icon>
      </v-btn>
      <v-btn class="ml-2" icon  small color="#6B6C6E">
        <v-icon dark large color='grey'> mdi-face-profile </v-icon>
      </v-btn>
    </v-app-bar>

    <v-dialog v-model="dialogLogout" max-width="400px">
          <v-card
            class="elevation-12"
            variant="elevated"
          >
            <v-card-title 
              class="bg-teal text-white text-center"
            >Apa anda yakin ingin Logout?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="teal" 
                variant="text" 
                @click="closeLogout"
              >
              Tidak
              </v-btn
              >
              <v-btn
                color="teal"
                variant="text"
                @click="onLogout"
              >
              Ya
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
      </v-dialog>
  </nav>
</template>
  
<script>
import { 
  GET_USER_TOKEN_GETTER,
  LOGOUT_ACTION 
} from '@/store/storeconstant';
import { mapActions, mapGetters } from 'vuex';

  export default {
      data: () =>({
          selectedItem: 0,
          drawer: true,
          rail: true,
          dialogLogout: false,
          result: {
            username: '0',
            email:'0',
          },
          items: [
            {icon: 'mdi-basket-fill', text: 'Stocks', to:'/stock'}, 
            {icon: 'mdi-cash', text: 'Debt', to:'/debt'},
            {icon: 'mdi-odnoklassniki', text: 'Users', to: '/users'},
        ],
          masters: [
              ['mdi-blur-linear', 'Master Item', '/masteritem'],
              ['mdi-face-agent', 'Customers', '/customer'],
              ['mdi-football-helmet', 'Asset', '/asset'],
            ],
        }),

  computed: {
    ...mapGetters('auth', {
      GET_USER_TOKEN_GETTER,
    }),
  },

  mounted() {

      let userDataString = localStorage.getItem('userData');
      let userData = JSON.parse(userDataString);

      if (userData) {
        this.result = userData;
      } 
  },
  
  methods: {
    ...mapActions('auth', {
      logout: LOGOUT_ACTION,
    }),

    actionClickNav(action) {
      if(action == "logout"){
        this.dialogLogout = true;
      }
    },

    closeLogout() {
      this.dialogLogout = false;
    },

    async onLogout() {
      try{
        await this.logout();
      } catch (error) {
        this.error = error;
      }
      
      this.$router.push('/login');
    },
  }
}
</script>
  
  <style>
  .image {
      border: 2px solid #2EBFAF;
  }
  
  </style>