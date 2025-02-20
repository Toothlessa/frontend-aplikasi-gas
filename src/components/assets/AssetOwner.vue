<template>
    <v-card
        class="elevation-12"
        variant="elevated"
    > 
    <v-card-title class="text-h6 font-weight-regular bg-blue-darken-1">
        <v-icon size="30" >mdi-account-circle</v-icon>&nbsp; Owners
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
            v-model="ownerName"
            label="Owner Name"
            variant="solo-inverted"
            @keyup.enter="createOwner"
        >
        </v-text-field>
        <div class="text-center">
            <v-btn
                class="bg-blue-darken-1"
                prepend-icon="mdi-copyright"
                text="Create"
                variant="outlined"
                @click="createOwner"
            >
            </v-btn>
            <v-btn
            class="bg-blue-darken-1"
            prepend-icon="mdi-close-circle-outline"
            text="Close"
            variant="outlined"
            @click="dialogDetails=false"
            >
            </v-btn>
        </div>
        <v-divider></v-divider>
            <v-col>
            <v-data-table
                :headers="ownerHeaders"
                :items="assetOwners"
                v-model:search="search" 
                :filter-keys="['name']" 
            >
                <template v-slot:[`item.number`]="{ index}">
                <tr>
                    <td>{{index + 1}}</td>
                </tr>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                <div class="text-end">
                    <v-icon size="small" @click="editItem(item)"> mdi-pencil-outline </v-icon>
                    <v-icon size="small" @click="updateStatusCustomer(item)"> mdi-radioactive </v-icon>
                </div>
                </template>
                <template v-slot:[`item.active_flag`]="{ item }">
                <div class="text-center">
                <v-chip
                    :color="item.active_flag ? 'green' : 'black'"
                    :text="item.active_flag ? 'Active' : 'Inactive'"
                    class="text-uppercase"
                    size="small"
                    label
                ></v-chip>
                </div>
            </template>
            </v-data-table>
            </v-col>
    </v-card>
</template>

<script>
</script>