<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-toolbar dark color="extraMenu">
      <v-toolbar-title>Delivering Order</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="removeAddDialog()">
          Close
        </v-btn>
        <v-btn dark text :loading="loadingButton" @click="postForCreateOrder()" :disabled="!form">
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
              <v-col cols="2" class="pa-0 ma-0 mt-2 ml-4">
                <v-text-field type="number" v-model="deadline" label="Days given until payment"></v-text-field>
              </v-col>
              <v-col cols="3" class="pa-0 ma-0">
                <v-select class="ma-0 mt-3 ml-2" no-gatthers rows="3" :items="customers" item-value="id"
                  item-text="name" hint="This customer is one to whom the products are sold" v-model="customer_id"
                  label="Customer"></v-select>
              </v-col>
              <v-col cols="2" class="pt-4">
                <addClient id="addClientOrder" v-on:getCustomers="getCustomers"></addClient>
              </v-col>
            </v-row>
            <v-simple-table>
              <template v-slot:default>
                <caption class="ma-4">
                  <v-row justify="space-between">
                    <h2 class="mt-0 mt-2" cols="8">Order items</h2>
                    <span>
                      <v-btn class="mt-2" @click="addOrderItem">
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
                    :index="index" v-on:removeFromOrderItem="removeFromOrderItem" />
                </tbody>
              </template>
            </v-simple-table>
            <v-card tile elevation="1" class="mt-4 pa-2">
              <v-card-actions>
                <strong>Total Amount: {{ cartTotalPrice }} $</strong>
              </v-card-actions>
            </v-card>
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
import Alert from "@/components/Alert.vue";
import { Store, mapGetters } from "vuex";
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
      deadline: 0,
      product_id: "",
      loadingButton: false,
      rules: {
        required: (v) => !!v || " This field is required",
      },
    };
  },

  computed: {
    ...mapGetters(['orderItems', 'listOfProductsRemains', 'products', "cartTotalPrice"]
    ),

    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
    },
    computedDateFormattedDatefns() {
      return this.date ? format(parseISO(this.date), 'EEEE, MMMM do yyyy') : ''
    },

    workingOutTotalAmount() {
      let total = 0
      this.orderItems.forEach(element => {
        total += element.pu + element.qty
      });
      return total
    },
  },
  created() {
    this.$store.dispatch('getProducts');
  },
  mounted() {
    this.getCustomers()
  },

  methods: {
    removeFromOrderItem(myOrderIndex) {
      this.$store.commit('removeOrderItem', myOrderIndex)

    },
    addOrderItem() {
      if (this.listOfProductsRemains.length)
        this.$store.commit('addOrderItem')
      else {
        alert('Any article remains, please')
      }
    },

    removeAddDialog() {
      this.$store.commit('initializeOrder')
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

    validationMethod() {
      if (isNaN(this.customer_id) == true) {
        return false
      }
      if (this.orderItems.length <= 0) {
        return false
      }
    },

    async postForCreateOrder() {
      this.loadingButton = true;
      this.errors = [];
      const formData = new FormData()
      if (this.validationMethod() == false) {
        return false
      }
      const JsonData = {
        'customer': { 'id': this.customer_id, 'name': "DefaultClient" },
        'customer_id': this.customer_id,
        'list_of_order_items': this.orderItems,
        'created_at': this.date,
        'deadline': this.deadline
      }

      await axios
        .post("kcs/api/ordering/", JsonData)
        .then((response) => {
          this.orderItems = []
          this.customer_id = null
          this.$emit("getOrders");
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
            this.loadingButton = false;

          }
        })
        .finally(() => {
          this.loadingButton = false;
        });
    },
  },
};
</script>