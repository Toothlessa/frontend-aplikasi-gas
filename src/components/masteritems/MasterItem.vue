<template>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-video-input-component"></v-icon> &nbsp; Master Item

            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Search by name" prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table v-model:search="search" :filter-keys="['nama']" :items="items">
            <template v-slot:[`header.stock`]>
                <div class="text-end">Stock</div>
            </template>

            <template v-slot:[`item.gambar`]="{ item }">
                <v-card class="my-2" elevation="2" rounded>
                    <v-img :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.gambar}`" height="64" cover></v-img>
                </v-card>
            </template>

            <template v-slot:[`item.rating`]="{ item }">
                <v-rating :model-value="item.rating" color="orange-darken-2" density="compact" size="small" readonly></v-rating>
            </template>

            <template v-slot:[`item.stock`]="{ item }">
                <div class="text-end">
                    <v-chip :color="item.stock ? 'green' : 'red'" :text="item.stock ? 'In stock' : 'Out of stock'" class="text-uppercase" size="small" label></v-chip>
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {
                search: '',
                items: [{
                        nama: 'Gas 3Kg',
                        gambar: '1.png',
                        kode: 'A01',
                        kategori: 'Bahan Pokok',
                        cogs: 699.99,
                        harga: 699.99,
                        rating: 5,
                        stock: true,
                    },
                    {
                        nama: 'Gas 5Kg',
                        gambar: '2.png',
                        kode: 'A02',
                        kategori: 'Bahan Pokok',
                        cogs: 699.0,
                        harga: 699.99,
                        rating: 4,
                        stock: false,
                    },
                    {
                        nama: 'Gas 12Kg',
                        gambar: '3.png',
                        kode: 'A03',
                        kategori: 'Bahan Pokok',
                        cogs: 699.99,
                        harga: 699.99,
                        rating: 3,
                        stock: true,
                    },
                    {
                        nama: 'Mie Ayam',
                        gambar: '4.png',
                        kode: 'A04',
                        kategori: 'Bahan Pokok',
                        cogs: 699.99,
                        harga: 699.99,
                        rating: 3,
                        stock: true,
                    },
                    {
                        nama: 'Bakso',
                        gambar: '5.png',
                        code: 'A05',
                        kategori: 'Bahan Pokok',
                        cogs: 699.99,
                        harga: 699.99,
                        rating: 5,
                        stock: true,
                    },
                ],
            }
        },
    }
</script>