<template>
    <v-container pa-4>
        <v-card class="mt-2" elevation="2">
            <v-row no-gatthers>
                <v-col cols="3 md-6" class="pa-2 ml-2">
                    <v-text-field class="mt-2 ml-3" v-model="searchFilter" append-icon="mdi-magnify" label="Search" dense
                        outlined></v-text-field>
                </v-col>
                <v-col cols="3 md-6" class="pa-0 ma-0">
                    <v-select class="mt-4 ml-3" outlined dense :items="products" item-value="id" item-text="name"
                        v-model="selectedProduct" label="product"></v-select>
                </v-col>
                <v-col cols="3" class="pa-0 ma-0 mt-2 ml-4">
                    <v-menu v-model="menu1" :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field :value="computedDateFormattedMomentjs" clearable label="Specify the date" readonly
                                v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
                        </template>
                        <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="2" class="mr-2" align="end">
                    <addOrderItem v-on:getOrders="getOrders"></addOrderItem>
                </v-col>
            </v-row>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header color="$vuetify.theme.dark ? 'primaryMenu' : 'white'">
                        <v-row> <!-- For all other iterations -->
                            <v-col cols="2">#Id</v-col>
                            <v-col cols="3">CustomerName</v-col>
                            <v-col cols="3">TotalAmount</v-col>
                            <v-col cols="2">Deadline</v-col>
                            <v-col cols="2">Date de l'opération</v-col>
                        </v-row>
                    </v-expansion-panel-header>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-expansion-panels focusable>
                <v-expansion-panel v-for="(itemOrder, index) in orders" :key="itemOrder.id">
                    <v-expansion-panel-header color="grey lighten-6" class="white--text">
                        <v-row color="purple" > <!-- Check if it's the first iteration -->
                            <v-col cols="2">{{ itemOrder.id }}</v-col>
                            <v-col cols="3">{{ itemOrder.customer.name }}</v-col>
                            <v-col cols="3">{{ itemOrder.total_amount }}</v-col>
                            <v-col cols="2">{{ itemOrder.deadline }}</v-col>
                            <v-col cols="2">{{ itemOrder.order_date }}</v-col>
                        </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-simple-table class="mt-0 ml-2">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            *
                                        </th>
                                        <th class="text-left">
                                            image
                                        </th>
                                        <th class="text-left">
                                            Name
                                        </th>
                                        <th class="text-left">
                                            unit_price
                                        </th>
                                        <th class="text-left">
                                            stock_quantity
                                        </th>
                                        <th class="text-left">
                                            total cost ($)
                                        </th>
                                        <th class="text-left">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in itemOrder.order_items" :key="item.id">
                                        <td>{{ item.id }}</td>
                                        <td>
                                            <v-img v-if="item.productPurchased.product.get_image !== null" cover height="50"
                                                width="50" :src="item.productPurchased.product.get_image" alt="">
                                            </v-img>
                                            <v-img v-else>
                                                not found
                                            </v-img>
                                        </td>
                                        <td>{{ item.productPurchased.product.name }}</td>
                                        <td><input type="text" :value="item.unit_price"> </td>
                                        <td><input type="text" :value="item.quantity"> </td>
                                        <td>{{ totalCost(item.unit_price, item.quantity) }}</td>
                                        <td>
                                            <!-- <editOrderItem :orderObjectFromParent="computedBuildingValues(item)"
                                                v-on:getOrders="getOrders">
                                            </editOrderItem>
                                            <deleteOrderItem :orderObjectFromParent="computedBuildingValues(item)"
                                                v-on:getOrders="getOrders">
                                            </deleteOrderItem> -->
                                        </td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>

            <template>
                <div class="text-justify mt-2 ml-0">
                    <v-row class="ma-0">
                        <v-col cols="4" class="mt-2">
                            ($) Total : {{ countTotalPrice.toFixed(3) }}
                        </v-col>
                        <v-col cols="3">
                            <v-pagination v-model="page" :length="NumberOfPage" circle></v-pagination>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="2">
                            <v-select :items="itemsPrint" v-model="page_size" label="Row per page"></v-select>
                        </v-col>
                    </v-row>
                </div>
            </template>
        </v-card>
    </v-container>
</template>
  
<script>
import addOrderItem from "./addOrderItem.vue";
import editOrderItem from "./editOrderItem.vue";
import deleteOrderItem from "./deletePurchase.vue";
import axios from "axios";
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
    components: { addOrderItem, editOrderItem, deleteOrderItem },
    data() {
        return {
            orders: [],
            date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
            menu1: false,
            menu2: false,
            search: "",
            counterHeader: 0,
            products: [],
            orders: [],
            searchFilter: "",
            dialog: false,
            selectedProduct: null,
            page: 1,
            count: 0,
            page_size: 2,
            itemsPrint: [2, 5, 10, 15, "All"],
        };
    },

    computed: {
        countTotalItems() {
            return this.orders.length
        },
        countTotalPrice() {
            return this.orders.reduce((acc, curVal) => {
                return acc += curVal.unit_price * curVal.stock_quantity
            }, 0.)
        },

        computedDateFormattedMomentjs() {
            console.log(this.date)
            return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
        },
        computedDateFormattedDatefns() {
            console.log(this.date)
            return this.date ? format(parseISO(this.date), 'EEEE, MMMM do yyyy') : ''
        },
        
        NumberOfPage() {
            return Math.ceil(this.count / this.page_size);
        },
        filteredItems() {
            let filtered = this.purchases
            const query = this.searchFilter.toLowerCase().trim()

            // Filter by selected category if present
            if (this.selectedProduct !== null) {
                filtered = filtered.filter(item =>
                    item.product.id === this.selectedProduct
                );
            }

            if (query) {
                return this.purchases.filter((item) =>
                    item.product.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
            }

            return filtered;
        }

    },

    //most used when the property changes for calling the api
    watch: {
        page: {
            handler() {
                this.getOrders();
            },
            //this property will mount the categories
            immediate: true,
        },

        page_size: {
            handler() {
                this.getOrders();
            },
        },

        date: {
            handler() {
                this.getOrders()
            }
        },
        search: function (newValue, olValue) {
            this.getOrders();
        },
    },
    async mounted() {
        this.getProducts()
        this.getOrders()
    },
    methods: {
        titleCountOrder() {
            this.item = false
        },
        computedBuildingValues(item) {

            return item
        },
        dataConvert(value) {
            return new Date(value)
        },

        totalCost(unitprice, stock_quantity) {
            let total = 0
            total = unitprice * stock_quantity
            return total.toFixed(3)
        },
        dataConvert(value) {
            return new Date(value)
        },
        async getProducts() {
            await axios
                .get(`kcs/api/products/`)
                .then((response) => {
                    this.products = response.data
                    this.products.push({
                        'id': null,
                        'name': "All products"
                    })
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        async getOrders() {
            if (this.search === "") {
                this.$store.commit("setIsLoadingData", true);
            }

            let pagination = ``;
            let search = ``;
            if (this.page_size === "All") {
                this.page_size = this.count;
            } else {
                pagination = `?created_at=${this.date}&page=${this.page}&perpage=${this.page_size}`;
            }

            if (this.search != "") {
                search = `&search=${this.search}`;
            }

            await axios
                .get(`kcs/api/custom-ordering/${pagination}${search}`)
                .then((response) => {
                    setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
                    // anticipate the django return
                    this.count = response.data.count
                    setTimeout(() => (this.orders = response.data.orders), 800);
                })
                .catch((error) => {
                    console.log(error);
                    setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
                });
        },
    },
};
</script>
  