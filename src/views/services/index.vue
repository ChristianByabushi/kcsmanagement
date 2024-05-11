<template>
    <v-container pa-4>
        <v-card class="mt-2" elevation="2">
            <v-row no-gatthers>
                <v-col class="pa-2 ml-2">
                    <v-text-field class="mt-2 ml-3" v-model="searchFilter" append-icon="mdi-magnify" label="Search"
                        dense outlined></v-text-field>
                </v-col>
                <v-col cols='3' class="pa-0 ma-0 mt-2 ml-4">
                    <v-menu v-model="menu1" :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field :value="computedDateFormattedMomentjs" clearable label="From" readonly
                                v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
                        </template>
                        <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols='3'>
                    <v-menu v-model="menu2" :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field class="mt-0" :value="computedDateFormattedMomentjsForDateTo" clearable
                                label="To" readonly v-bind="attrs" v-on="on"
                                @click:clear="dateto = null"></v-text-field>
                        </template>
                        <v-date-picker v-model="dateto" @change="menu2 = false"></v-date-picker>
                    </v-menu>
                </v-col>
                <v-col cols="3" class="mr-2" align="end">
                    <addServiceOrderItem v-on:getOrders="getOrders"></addServiceOrderItem>
                </v-col>
            </v-row>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header color="$vuetify.theme.dark ? 'primaryMenu' : 'white'">
                        <v-row> <!-- For all other iterations -->
                            <v-col cols="2" style="max-width: 50px;"> #Id</v-col>
                            <v-col cols="2">Date de l'opération</v-col>
                            <v-col cols="2">CustomerName</v-col>
                            <v-col cols="2">Deadline</v-col>
                            <v-col cols="2">TotalAmount</v-col>
                            <v-col cols="2">Actions</v-col>
                        </v-row>
                    </v-expansion-panel-header>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-expansion-panels focusable>
                <v-expansion-panel v-for="(itemOrder, index) in orders" :key="itemOrder.id">
                    <v-expansion-panel-header color="grey lighten-6" class="white--text">
                        <v-row color="purple"> <!-- Check if it's the first iteration -->
                            <v-col cols="2" style="max-width: 50px;">{{ itemOrder.id }}</v-col>
                            <v-col cols="2">{{ itemOrder.formatted_order_date }}</v-col>
                            <v-col cols="2">{{ itemOrder.customer.name }}</v-col>
                            <v-col cols="2">{{ itemOrder.deadline }}</v-col>
                            <v-col cols="2">{{
                        computeTotalCostOfOrder(itemOrder.order_service_items) }}</v-col>
                            <v-col cols=2>
                                <deleteOrder :OrderObject="itemOrder" v-on:getOrders="getOrders">
                                </deleteOrder>
                                <editPartOrder :OrderObject="itemOrder" v-on:getOrders="getOrders">
                                </editPartOrder>
                                <v-icon medium class="ml-2" color="primaryMenu" @click="printOrder(itemOrder.id)">
                                    mdi-printer
                                </v-icon>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-simple-table class="mt-0 ml-2 subtable">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            *
                                        </th>
                                        <th class="text-left">
                                            Category
                                        </th>
                                        <th class="text-left">
                                            Description
                                        </th>
                                        <th class="text-left">
                                            Total_price
                                        </th>

                                        <th class="text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in itemOrder.order_service_items" :key="item.id">
                                        <td>{{ item.id }}</td>
                                        <td class="text-left">{{ item.category.name }}</td>
                                        <td class="text-left">{{ item.description }}</td>
                                        <td class="text-left"><input type="text" :value="item.total_price"> </td>
                                        <td>

                                            <addUniqueServiceItem :OrderObject="computedBuildingValues(itemOrder)"
                                                v-on:getOrders="getOrders">
                                            </addUniqueServiceItem>
                                            <editOrderItem :customerOrder_id=itemOrder.id
                                                :OrderItemObject="computedBuildingValues(item)"
                                                v-on:getOrders="getOrders">
                                            </editOrderItem>

                                            <deleteOrderItem :OrderItemObject="computedBuildingValues(item)"
                                                v-on:getOrders="getOrders">
                                                <v-icon>mdi-delete</v-icon>
                                            </deleteOrderItem>
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
                            ($) Total : {{ countTotalPrice }}
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
import addServiceOrderItem from "./addServiceOrderItem.vue";
import editPartOrder from './editPartOrder.vue'
import editOrderItem from "./editOrderItem.vue";
import deleteOrderItem from "./deleteOrderItem.vue";
import deleteOrder from "./deleteOrder.vue";
import addUniqueServiceItem from "./addUniqueServiceItem.vue";
import axios from "axios";
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
    components: { addServiceOrderItem, addUniqueServiceItem, deleteOrder, editPartOrder, editOrderItem, deleteOrderItem },
    data() {
        return {
            orders: [],
            date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
            dateto: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
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
            page_size: 5,
            itemsPrint: [2, 5, 10, 15, "All"],
        };
    },

    computed: {
        countTotalItems() {
            return this.orders.length
        },
        countTotalPrice() {
            var total_amount = 0.0
            this.orders.forEach(element => {
                element.order_service_items.forEach(item => {
                    total_amount += parseFloat(item.total_price)
                });
            })

            return total_amount.toFixed(3)
        },

        computedDateFormattedMomentjs() {
            return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
        },
        computedDateFormattedMomentjsForDateTo() {
            return this.dateto ? moment(this.dateto).format('dddd, MMMM Do YYYY') : ''
        },

        computedDateFormattedDatefns() {
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
        dateto: {
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

        computeTotalCostOfOrder(order_service_items) {
            return order_service_items.reduce((acc, currentItem) => {
                return acc += parseFloat(currentItem.total_price)
            }, 0.)
        },

        dataConvert(value) {
            return new Date(value)
        },

        totalCost(unitprice, stock_quantity) {
            let total = 0
            total = unitprice * stock_quantity
            return total.toFixed(3)
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

        async printOrder(orderItemId) {
            const config = {
                responseType: 'blob'
            };
            axios.get(`kcs/api/order-state/${orderItemId}?typeOrder=True`, config)
                .then(response => {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const pdfUrl = window.URL.createObjectURL(blob);
                    window.open(pdfUrl);
                })
                .catch(error => {
                    console.error(error);
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

            var dateVariables = ''
            if (this.search != "") {
                search = `&search=${this.search}`;
            }
            if (this.date != null) {
                dateVariables = `&datelimitleft=${this.date}`
            }

            if (this.dateto != null) {
                dateVariables += `&datelimitright=${this.dateto}`
            }

            await axios
                .get(`kcs/api/orders-service/${pagination}${search}${dateVariables}`)
                .then((response) => {
                    setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
                    // anticipate the django return
                    this.count = response.data.count
                    setTimeout(() => (
                        this.orders = response.data.orders), 800);
                })
                .catch((error) => {
                    console.log(error);
                    setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
                });
        },
    },
};
</script>

<style>
.subtable th {
    background-color: rgb(222, 222, 238);
    color: white;
    font-size: larger;
}
</style>