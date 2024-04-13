<template>
  <v-dialog v-model="dialog" persistent max-width="700px" height='700px'>
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="ma-1" elevation="2" color="primary" icon outlined v-bind="attrs" v-on="on">
        <v-icon small> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h6">EDIT GENERAL DETAILS OF ORDER #({{ OrderObject.id }})</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row no-gatthers class="mt-1">
              <v-col cols="4" class="pa-0 ma-0 mt-2 ml-4">
                <v-menu v-model="menu1" :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="computedDateFormattedMomentjs" hint="When this order has been given ?"
                      clearable label="Date of the order" readonly v-bind="attrs" v-on="on"
                      @click:clear="date = null"></v-text-field>
                  </template>
                  <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="2" class="pa-0 ma-0 mt-2 ml-4">
                <v-text-field type="number" v-model="deadline" label="Days given until payment"></v-text-field>
              </v-col>
              <v-col cols="4" class="pa-0 ma-0">
                <v-select class="ma-0 mt-3 ml-2" no-gatthers rows="3" :items="customers" item-value="id"
                  item-text="name" hint="This customer is one to whom the products are sold" v-model="customer_id"
                  label="Customer"></v-select>
              </v-col>
              <v-col cols="1" class="pt-4">
                <addClient id="addClientOrder" v-on:getCustomers="getCustomers"></addClient>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <div class="error mt-2" v-if="errors.length">
          <v-alert dense type="error" v-for="error in errors" :key="error">{{
    error
  }}</v-alert>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="removeAddDialog()">
          Close
        </v-btn>
        <v-btn :loading="loadingButton" color="blue darken-1" text @click="editOrder()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import addClient from "../clients/addClient.vue";
import moment from 'moment'
import axios from 'axios';
import { format, parseISO } from 'date-fns'
export default {
  name: "editPartOrderItem",
  props: {
    OrderObject: Object,
  },
  components: { addClient },

  data() {
    return {
      dialog: false,
      form: false,
      errors: [],
      customers: [],
      dealine: 0,
      date: format(parseISO(this.OrderObject.order_date), 'yyyy-MM-dd'),
      menu1: false,
      deadline: this.OrderObject.deadline,
      menu2: false,
      customer_id: this.OrderObject.customer.id,
      errors: [],
      loadingButton: false,
      id: this.OrderObject.id,
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
    removeAddDialog() {
      this.dialog = false;
      this.loadingButton = false;
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

    async editOrder() {
      this.loadingButton = true;
      this.errors = [];
      var result = true

      if (isNaN(this.deadline) == true) {
        this.errors.push('Error: The deadline value musnt be a interger not Nan')
        result = false
      }

      if (isNaN(this.customer_id) == true || this.customer_id == null) {
        this.errors.push('Error: Please choose the customer first')
        result = false
      }

      if (result == false) {
        this.loadingButton = false;
        return false
      }

      else {
        await axios
          .put("kcs/api/ordering/", {
            'id': this.id,
            'customer_id': this.customer_id,
            'deadline': this.deadline,
            'date': this.date
          })
          .then((response) => {
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
              console.log(JSON.stringify(error.response.data));
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
      }
    },
  },
};
</script>
