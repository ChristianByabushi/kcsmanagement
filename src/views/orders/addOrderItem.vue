<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-toolbar dark color="extraMenu">
      <v-toolbar-title>Delivering Order</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="removeAddDialog()">
          Close
        </v-btn>
        <v-btn dark text :loading="loadingButton" @click="postForAddingOrderItem()" :disabled="!form">
          Save
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-1" elevation="2" color="extraMenu" icon outlined v-bind="attrs" v-on="on">
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row no-gatthers class="mt-1">
              <v-col cols="3" class="pa-0 ma-0 mt-2 ml-4">
                <v-menu v-model="menu1" :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="computedDateFormattedMomentjs" hint="When this orders has been given ?"
                      clearable label="Date of the order" readonly v-bind="attrs" v-on="on"
                      @click:clear="date = null"></v-text-field>
                  </template>
                  <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="3" class="pa-0 ma-0">
                <v-select class="ma-0 mt-3 ml-3" no-gatthers rows="3" :items="customers" item-value="id" item-text="name"
                  hint="This customer is one to whom the products are sold" v-model="customer_id"
                  label="Customer"></v-select>
              </v-col>
              <v-col>
                <addClient id="addClientOrder" v-on:getCustomers="getCustomers"></addClient>
              </v-col>
              <v-spacer></v-spacer>
            </v-row>
            <v-simple-table>
              <template v-slot:default>
                <caption class="ma-4">
                  <v-row justify="space-between">
                    <h2 class="mt-0 mt-2" cols="8">Order items</h2>
                    <span>
                      <v-btn class="mt-2" @click="functionaddOrderItem()">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </span>
                  </v-row>
                </caption>
                <thead>
                  <tr>
                    <th class="text-left">
                      #Num
                    </th>
                    <th class="text-left">
                      Item
                    </th>
                    <th class="text-left">
                      P.U
                    </th>
                    <th class="text-left">
                      Qty
                    </th>
                    <th class="text-left">
                      Total
                    </th>
                    <th class="text-left">
                      <v-icon> mdi-pen </v-icon>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ItemObject v-for="(item, index) in orderItems" v-bind:key="index" v-bind:orderItem="item"
                    :index="index" v-on:removeFromOrderItem="removeFromOrderItem" @updateItem="updateItem" />
                </tbody>
              </template>
            </v-simple-table>
            <v-row>

            </v-row>
          </v-form>
        </v-container>
        <div class="error mt-2" v-if="errors.length">
          <v-alert dense type="error" v-for="error in errors" :key="error">{{
            error
          }}</v-alert>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import addClient from "../clients/addClient.vue";
import ItemObject from "../orders/orderItem.vue"
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
  name: "addOrderItem",
  components: { addClient, ItemObject },
  data() {
    return {
      dialog: false,
      form: false,
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      menu1: false,
      menu2: false,
      errors: [],
      customers: [],
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      customer_id: null,
      stock_quantity: "",
      unit_price: "",
      products: "",
      orderItems: [],
      product_id: "",
      loadingButton: false,
      rules: {
        required: (v) => !!v || " This field is required",
      },
    };
  },
  computed: {
    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
    },
    computedDateFormattedDatefns() {
      return this.date ? format(parseISO(this.date), 'EEEE, MMMM do yyyy') : ''
    },
  },

  mounted() {
    this.getCustomers()
  },

  methods: {

    removeFromOrderItem(myOrderIndex) {
      this.orderItems = this.orderItems.filter(
        (item, index) => index !== myOrderIndex
      );
    },

    updateItem(updateItemObject) {
      console.log(updateItemObject)
    },


    functionaddOrderItem() {
      this.orderItems.push(
        {
          'pu': 0,
          'qty': 0,
          'product_id': 0
        }
      )
    },
    removeAddDialog() {
      this.product_id = "";
      this.dialog = false;
      this.unit_price = "";
      this.customer_id = "";
      this.stock_quantity = "";
      this.errors = [];
    },
    async getCustomers() {
      await axios
        .get(`kcs/api/customers/`)
        .then((response) => {
          this.customers = response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async postForAddingOrderItem() {
      this.loadingButton = true;
      this.errors = [];
      const formData = new FormData()
      formData.append('product_id', this.product_id)
      formData.append('customer_id', this.supplier_id)
      formData.append('unit_price', this.unit_price)
      formData.append('stock_quantity', this.stock_quantity)
      formData.append('created_at', this.date)

      await axios
        .post("kcs/api/products-purchased/", formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((response) => {
          this.$emit("getPurchases");
          this.dialog = false;
        })

        .catch((error) => {
          if (error.response) {
            for (const property in error.response.data) {
              this.errors.push(
                `${property} : ${error.response.data[property]}`
              );
            }
          } else if (error.message) {
            for (i in error) {
              console.log(i);
            }
            this.errors.push("Something went wrong, Please try again");
            console.log(JSON.stringify(error.message));
          }
        })
        .finally(() => {
          this.loadingButton = false;
        });
    },
  },
};
</script>
  