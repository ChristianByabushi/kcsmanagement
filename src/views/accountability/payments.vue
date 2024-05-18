<template>
    <v-container pa-4>
        <v-card class="mt-2" elevation="2">
            <v-row no-gatthers>
                <v-col class="pa-2 ml-2">
                    <v-select rows="3" outlined :items="clients" item-value="id" item-text="name" hint="Select Client"
                        v-model="selectedClient" label="Client"></v-select>
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
            </v-row>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header color="$vuetify.theme.dark ? 'primaryMenu' : 'white'">
                        <v-row> <!-- For all other iterations -->
                            <v-col cols="2">Date</v-col>
                            <v-col cols="2">Client#id</v-col>
                            <v-col cols="2">Amount</v-col>
                            <v-col cols="2">Paid</v-col>
                            <v-col cols="2">Due</v-col>
                            <v-col cols="2">Decision</v-col>
                        </v-row>
                    </v-expansion-panel-header>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-expansion-panels focusable>
                <v-expansion-panel v-for="(itemOrder, index) in orderPayments" :key="index">
                    <v-expansion-panel-header :color="CheckCostOfOrder(itemOrder)" class="white--text">
                        <v-row> <!-- Check if it's the first iteration -->
                            <v-col cols="2">{{ itemOrder.orderPayment.order_date }}</v-col>
                            <v-col cols="2">{{ itemOrder.orderPayment.customer.name }}#{{
                        itemOrder.orderPayment.id }}</v-col>
                            <v-col cols="2">{{ itemOrder.orderPayment.total_amount }}</v-col>
                            <v-col cols="2">{{ itemOrder.paidAmountOrder }}</v-col>
                            <v-col cols="2">{{
                        computeTotalCostOfOrder(itemOrder) }}</v-col>
                            <v-col cols=2>
                                <addPayment :OrderObject="itemOrder.orderPayment"
                                    :paidAmountOrder="itemOrder.paidAmountOrder"
                                    v-on:getOrderPayments="getOrderPayments">
                                </addPayment>
                                <!-- 
                                <deleteOrder :OrderObject="itemOrder" v-on:getOrderPayments="getOrderPayments">
                                </deleteOrder>
                                <editPartOrder :OrderObject="itemOrder" v-on:getOrderPayments="getOrderPayments">
                                </editPartOrder>
                                <v-icon medium class="ml-2" color="primaryMenu" @click="printOrder(itemOrder.id)">
                                    mdi-printer
                                </v-icon> 
                            -->
                            </v-col>
                        </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-simple-table class="mt-0 ml-2 subtable">
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            IdOrder
                                        </th>
                                        <th class="text-left">
                                            Payment_date
                                        </th>

                                        <th class="text-left">
                                            Amount Paid
                                        </th>

                                        <th class="text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in itemOrder.PayementsOfClient" :key="item.id">
                                        <td class="text-left">{{ item.id }}</td>
                                        <td>{{ item.formatted_payment_date }}</td>
                                        <td class="text-left">{{ item.amount_paid }}</td>
                                        <td>
                                            <editPayment :OrderObject="itemOrder.orderPayment"
                                                :paidAmountOrder="itemOrder.paidAmountOrder"
                                                :payementItem="item" v-on:getOrderPayments="getOrderPayments">
                                            </editPayment>
                                            <!-- 

                                            <deleteOrderItem :OrderItemObject="computedBuildingValues(item)"
                                                v-on:getOrderPayments="getOrderPayments">
                                                <v-icon>mdi-delete</v-icon>
                                            </deleteOrderItem> 
-->
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
                            <div> ($) Total Due : {{ countTotalDue }}</div>
                            <div> ($) Total Paid : {{ countTotalPaid }}</div>
                            <div> ($) Difference : {{ countTotalDue - countTotalPaid }} </div>

                        </v-col>
                        <v-col cols="3">
                            <v-pagination v-model="page" :length="NumberOfPage" circle></v-pagination>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="2">
                            <v-select :items="itemsOnPage" v-model="page_size" label="Row per page"></v-select>
                        </v-col>
                    </v-row>
                </div>
            </template>
        </v-card>
    </v-container>
</template>

<script>
import axios from "axios";
import moment from 'moment'
import editPayment from './editPayment.vue'
import { format, parseISO } from 'date-fns'
export default {
    components: { editPayment },
    data() {
        return {
            orderPayments: [],
            orders: [],
            date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
            dateto: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
            menu1: false,
            menu2: false,
            clients: [],
            selectedClient: "",
            counterHeader: 0,
            products: [],
            orders: [],
            searchFilter: "",
            dialog: false,
            selectedProduct: null,
            page: 1,
            count: 1,
            page_size: "5",
            itemsOnPage: ['2', "5", '10', "15", "All"],
        };
    },

    computed: {
        countTotalDue() {
            var total_amount = 0.0
            this.orderPayments.forEach(item => {
                total_amount += parseFloat(item.orderPayment.total_amount)
            })

            return total_amount.toFixed(3)
        },
        countTotalPaid() {
            var total_amount = 0.0
            this.orderPayments.forEach(item => {
                total_amount += parseFloat(item.paidAmountOrder)
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
            if (this.page_size == 'All') {
                return 1
            }
            let answer = Math.ceil(parseInt(this.count) / parseInt(this.page_size));
            if (answer < 1)
                answer = 1
            return answer
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
                this.getOrderPayments();
            },
            //this property will mount the categories
            immediate: true,
        },

        page_size: {
            handler() {
                this.getOrderPayments();
            },
        },

        date: {
            handler() {
                this.getOrderPayments()
            }
        },
        dateto: {
            handler() {
                this.getOrderPayments()
            }
        },
        selectedClient: function (newValue, olValue) {
            this.getOrderPayments();
        },
    },
    async mounted() {
        this.addNullValueTolistClients()
        this.getOrderPayments()
    },
    created() {
        this.$store.dispatch('getCustomers');
    },
    methods: {
        addNullValueTolistClients() {
            this.clients = []
            this.clients = this.$store.state.customers
            this.clients.push({
                'name': null,
                'id': ''
            }
            )
        },
        titleCountOrder() {
            this.item = false
        },
        computedBuildingValues(item) {
            return item
        },

        CheckCostOfOrder(itemOrder) {
            if (itemOrder.orderPayment.total_amount > itemOrder.paidAmountOrder) {
                return 'grey lighten-6'
            } else {
                return '#303f9f'

            }
        },
        computeTotalCostOfOrder(itemOrder) {
            let answer = itemOrder.orderPayment.total_amount - itemOrder.paidAmountOrder
            return answer.toFixed(3)
        },

        dataConvert(value) {
            return new Date(value)
        },

        totalCost(unitprice, stock_quantity) {
            let total = 0
            total = unitprice * stock_quantity
            return total.toFixed(3)
        },

        async getOrderPayments() {
            this.$store.commit("setIsLoadingData", true)
            let pagination = ``;
            let search = ``;
            if (this.selectedClient != '') {
                search = `&client_id=${this.selectedClient}`
            } else if (this.selectedClient == null) {
                this.selectedClient = ''
                search = ''
            }
            if (this.page_size === "All") {
                pagination = `?created_at=${this.date}&page=${this.page}&perpage=${this.count}`;
            } else {
                pagination = `?created_at=${this.date}&page=${this.page}&perpage=${this.page_size}`;
            }

            var dateVariables = ''

            if (this.date != null) {
                dateVariables = `&orderDateFrom=${this.date}`
            }

            if (this.dateto != null) {
                dateVariables += `&orderDateTo=${this.dateto}`
            }

            await axios
                .get(`kcs/api/payment-order/${pagination}${search}${dateVariables}`)
                .then((response) => {
                    setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
                    // anticipate the django return
                    this.count = response.data.count

                    setTimeout(() => (
                        this.orderPayments = response.data.orders), 800);
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