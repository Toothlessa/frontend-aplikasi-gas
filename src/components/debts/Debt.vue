<template>
   <!-- <v-container class="bg-"> -->
       <v-row no-gutters>
           <v-div>
               <v-card
                   class="elevation-12 pa-1 ma-1"
                   color="blue-grey-lighten-5"
                   max-height="auto"
                   max-width="auto"
               >
               <v-card-title class="text-h6 font-weight-regular bg-teal">
                   <v-icon size="30">mdi-cash</v-icon>&nbsp;Input Debt
                </v-card-title>
                   <v-col cols="12">
                        <v-autocomplete
                           label="Customer Name"
                           v-model="selectedCustomer"
                           :items="customers"
                           item-title="customer_name"
                           item-value="id"
                           variant="outlined"
                           clearable
                        >
                        <template v-slot:item="{ props, item }">
                            <v-list-item
                            v-bind="props"
                            :subtitle="item.raw.nik"
                            :title="item.raw.customer_name"
                            ></v-list-item>
                        </template>
                        </v-autocomplete>
                        <v-text-field
                           v-model="editedDebt.amount"
                           label="Total Debt"
                           type="number"
                           align="center"
                           variant="outlined"
                           clearable
                       >
                       </v-text-field>
                        <v-textarea
                            v-model="editedDebt.description"
                            label="Description"
                            variant="outlined"
                            row-height="25"
                            rows="3"
                            auto-grow
                       >
                        </v-textarea>
                        <v-checkbox
                            v-model="isPay"
                            label="Pay Debt??"
                            color="teal"
                            value="teal"
                            hide-details
                            @keyup.enter="saveDebt"
                        ></v-checkbox>
                       <v-snackbar
                           class="text-center text-teal"
                           v-model="hasSaved"
                           :timeout="2000"
                           location="top center"
                       >
                       Data have been saved
                       </v-snackbar>
                   <v-col class="text-right">
                       <v-btn
                           class="text-white"
                           absolute
                           color="teal"
                           rounded="lg"
                           :loading="loadingButton"
                           :disabled="isSaveDisabled"
                           @click="saveDebt"
                       >
                       Save
                       </v-btn>
                   </v-col>
               </v-col>
               </v-card>
           </v-div>
           <v-col>
               <v-card 
                   class="elevation-12 font-weight-regular pa-1 ma-1" 
                   max-height="auto"
                   max-width="auto" 
                   variant="elevated"
                   color="#f0f5ff"
               >
               <v-card-title class="text-h6 font-weight-regular bg-teal">
                   <v-icon size="30">mdi-cash-multiple</v-icon>&nbsp; Daftar Hutang
               </v-card-title>
                   <v-data-table
                       class="text-black bg-blue-grey-lighten-5"
                       :headers="headers"
                       :items="debts"
                       :search="search"
                       loading-text="Loading... Please wait"
                       :loading="loadingData"
                   >
                    <template v-slot:[`item.actions`]="{item}">
                        <v-icon size="20" @click="detailDebt(item)">mdi-developer-board </v-icon>
                    </template>
                   </v-data-table>
                        <v-dialog v-model="dialogDetails" width="800">
                            <v-card
                                class="elevation-12"
                                variant="elevated"
                            >
                            <v-table class="mt-n2">
                            <template v-slot:default>
                                <thead class="bg-teal">
                                <tr>
                                    <!-- <th class="text-left">No</th> -->
                                    <th class="text-left">Customer Name</th>
                                    <th class="text-left">Description</th>
                                    <th class="text-left">Pay</th>
                                    <th class="text-left">Total Debt</th>
                                    <th class="text-left">Created Date</th>
                                    <th class="text-left">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="item in customerDetail" :key="item.id">
                                    <td>{{ item.customer_name }}</td>
                                    <td>{{ item.description }}</td>
                                    <td>{{ item.amount_pay }}</td>
                                    <td>{{ item.total }}</td>
                                    <td>{{ item.created_at }}</td>
                                    <td>
                                        <v-btn
                                            variant="text"
                                            @click="editDebt(item)"
                                        >
                                        <v-icon size="20">mdi-update</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                                </tbody>
                            </template>
                            </v-table>
                            </v-card>
                        </v-dialog>
                            <v-dialog 
                                v-model="dialogUpdate" 
                                transition="dialog-top-transition"
                                width="300"
                            >
                                <v-card
                                    class="elevation-12"
                                    color="blue-grey-lighten-5"
                                >
                                <v-card-title class="text-h6 font-weight-regular bg-teal">
                                    <v-icon size="30">mdi-cash</v-icon>&nbsp;Edit Debt
                                </v-card-title>
                                    <v-col cols="12">
                                        <v-autocomplete
                                            label="Customer Name"
                                            v-model="updateCustomer"
                                            :items="customers"
                                            item-title="customer_name"
                                            item-value="id"
                                            variant="outlined"
                                            clearable
                                            >
                                            <template v-slot:item="{ props, item }">
                                                <v-list-item
                                                v-bind="props"
                                                :subtitle="item.raw.nik"
                                                :title="item.raw.customer_name"
                                                ></v-list-item>
                                            </template>
                                        </v-autocomplete>
                                        <v-text-field
                                            label="Pay"
                                            v-model="updatedDebt.amount_pay"
                                            type="number"
                                            variant="outlined"
                                            :disabled="!disableAmountPay"
                                            @keyup.enter="updateDebt"
                                        >
                                        </v-text-field>
                                        <v-text-field
                                            v-model="updatedDebt.total"
                                            label="Total Debt"
                                            type="number"
                                            variant="outlined"
                                            :disabled="!disableTotal"
                                            @keyup.enter="updateDebt"
                                        >
                                        </v-text-field>
                                        <v-textarea
                                            v-model="updatedDebt.description"
                                            label="Description"
                                            variant="outlined"
                                            row-height="25"
                                            rows="3"
                                            auto-grow
                                            @keyup.enter="updateDebt"
                                        >
                                        </v-textarea>
                                    </v-col>
                                    <v-card-actions>
                                        <v-btn class="text-white mb-2" color="teal" variant="elevated"  @click="dialogUpdate = false">
                                        Cancel
                                        </v-btn>
                                        <v-btn class="text-white mb-2" color="teal" variant="elevated" @click="updateDebt">
                                        Update
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            
                            </v-dialog>
                    </v-card>
            </v-col>
       </v-row>
   <!-- </v-container> -->
</template>
<script>
import AxiosInstance from '@/services/AxiosInstance';
import Validations from '@/services/Validations';
import store from '@/store/store';
import { GET_USER_TOKEN_GETTER } from '@/store/storeconstant';

export default{
   data:() => ({
        headers: [
            {
            align: 'start',
            key: 'customer_name',
            title: 'Customer Name',
            },
            { key: 'total_debt', title: 'Total Debt', align: 'center',  },
            { key: 'total_pay', title: 'Total Pay', align: 'center' },
            { key: 'debt_left', title: 'Debt Left', align: 'center'},       
            { key: 'actions', title: 'Details', align:'center', sortable: false },
        ],
        editedDebt: {
            customer_id: null,
            customer_name: null,
            amount: null,
            description: null,
        },
        updatedDebt: {
            id: null,
            amount_pay: 0,
            total: 0,
            description: null,
        },
        updateCustomer: null,
        selectedCustomer: null,
        search: '',
        debts: [],
        customers: [],
        customerDetail: [],
        dialogDetails: false,
        dialogUpdate: false,
        hasSaved: false,
        loadingData: true,
        loadingButton: false,
        isPay: false,
        disableAmountPay: false,
        disableTotal: false,
        error: '',
   }),

   computed: {
       isSaveDisabled(){
           return !(this.selectedCustomer && this.editedDebt.amount && this.editedDebt.description);
       }
   },

   created() {
    //call to Load Data
    this.debtSummaryLoad();
    this.customerLoad();
   },

   methods : {

        async formatPrice (value) {
          return await `Rp${parseFloat(value).toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&.')}`
        },

        async customerLoad() {

            try {
                await AxiosInstance.get(`http://127.0.0.1:8000/api/customers/all`,
                {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                }
            })
            .then((response) => { this.customers = response.data.data; });

            } catch(error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
                this.alert = true
            }
        },

        async debtSummaryLoad() {

            try {
                await AxiosInstance.get(`http://127.0.0.1:8000/api/debts/summary`, {
                    headers: {
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json',
                        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    }
                    }
                )
                    .then((response) => {
                        this.debts = response.data.data;
                    
                    if(response.status === 200) {
                        this.loadingData = false;
                    }
                });
            } catch (error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
                this.alert = true
            }
        },
        
        async detailDebt(item){
            this.editedDebt = Object.assign({}, item);

            try {
                await AxiosInstance.get(`http://127.0.0.1:8000/api/debts/customer/`+this.editedDebt.customer_id,
                {
                    headers: {
                    'Content-Type': 'application/json', 
                    'Accept': 'application/json',
                    'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                }
            })
            .then((response) => { this.customerDetail = response.data.data; });
            } catch(error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
                this.alert = true
            }

            this.dialogDetails = true;
        },

        async saveDebt() {
            // console.log(this.debts[0].customer_id);
            let postData = '';
            if(this.isPay){
                    postData = {
                        description: this.editedDebt.description,
                        amount_pay: this.editedDebt.amount,
                    }
                } else {
                    postData = {
                        description: this.editedDebt.description,
                        total: this.editedDebt.amount,
                    }
                }

            try {

                await AxiosInstance.post(`http://127.0.0.1:8000/api/debts/` +  this.selectedCustomer, postData, {
                    headers: {
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json',
                        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    }
                    }
                )
                    .then((response) => {
                        this.debts = response.data.data;
                        Object.freeze(this.debts);
                    
                    if(response.status === 201) {
                        this.isPay = false;
                        this.selectedCustomer = null;
                        this.editedDebt.description = null;
                        this.editedDebt.amount = null;
                        this.hasSaved = true;
                    }
                });
            } catch(error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
                this.alert = true
            }
        },

        editDebt(item) {
            this.updatedDebt = Object.assign({}, item);
            this.updateCustomer = item.customer_id;

            if(this.updatedDebt.amount_pay){
                this.disableAmountPay = true;
            } else {
                this.disableAmountPay = false;
            }

            if(this.updatedDebt.total){
                this.disableTotal = true;
            } else {
                this.disableTotal = false;
            }

            this.dialogUpdate = true;
        },

        async updateDebt() {
            let postData = {
                    customer_id: this.updateCustomer,
                    description: this.updatedDebt.description,
                    amount_pay: this.updatedDebt.amount_pay,
                    total: this.updatedDebt.total
            }
            try {

                await AxiosInstance.patch(`http://127.0.0.1:8000/api/debts/` +  this.updatedDebt.id, postData, {
                    headers: {
                        'Content-Type': 'application/json', 
                        'Accept': 'application/json',
                        'Authorization': store.getters[`auth/${GET_USER_TOKEN_GETTER}`],
                    }
                    }
                )
                    .then((response) => {

                    if(response.status === 200) {
                        this.detailDebt(postData);
                        this.debtSummaryLoad();
                        this.editedDebt.description = null;
                        this.dialogUpdate = false;
                        this.hasSaved = true;
                    }
                });
            } catch(error) {
                this.error = Validations.getErrorMessageFromCode(error.response.data.errors[0]);
                this.alert = true
            }
        },

   },
}
</script>

<style scoped>
   .border {
   border: 2px solid #2ebfaf !important;
   }
</style>