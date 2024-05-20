<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-1" elevation="2" color="primary" icon outlined v-bind="attrs" v-on="on">
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Sell in the Stock</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row class="text-center">
              <v-col cols="12">
                <v-menu v-model="menu1" :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="computedDateFormattedMomentjs" clearable label="Specify the date" readonly
                      v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
                  </template>
                  <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-select rows="3" outlined :items="products" item-value="id" item-text="name" v-model="product_id"
                  label="Select the product purchased"></v-select>
              </v-col>
              <v-col cols="6">
                <v-select rows="3" outlined :items="suppliers" item-value="id" item-text="name" hint="Select a supplier"
                  v-model="supplier_id" label="supplier"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field outlined v-model="unit_price" label="Unit Price" persistent-hint required
                  :rules="[rules.required]" clearable rows="4" clear-icon="mdi-close-circle"
                  value="This is clearable text."></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field outlined v-model="stock_quantity" label="Quantity" persistent-hint required
                  :rules="[rules.required]" clearable rows="4" clear-icon="mdi-close-circle"
                  value="This is clearable text."></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <h3 class="ml-4">Total price : {{ stock_quantity * unit_price }}</h3>
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
        <v-btn :loading="loadingButton" color="blue darken-1" text @click="postForAddingProductPurchased()"
          :disabled="!form">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
  name: "addPurchase",
  data() {
    return {
      dialog: false,
      form: false,
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      menu1: false,
      menu2: false,
      errors: [],
      suppliers: [],
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      supplier_id: null,
      stock_quantity: "",
      unit_price: "",
      products: "",
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
    this.getProducts()
    this.getSuppliers()
  },
  methods: {
    removeAddDialog() {
      this.product_id = "";
      this.dialog = false;
      this.unit_price = "";
      this.supplier_id = "";
      this.stock_quantity = "";
      this.errors = [];
    },
    async getProducts() {
      await axios
        .get(`kcs/api/products/`)
        .then((response) => {
          this.products = response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getSuppliers() {
      await axios
        .get(`kcs/api/suppliers/`)
        .then((response) => {
          this.suppliers = response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async postForAddingProductPurchased() {
      this.loadingButton = true;
      this.errors = [];
      const formattedDate = moment(this.date).format('YYYY-MM-DD') + ' ' +
        moment().format('HH:mm:ss');
      const formData = new FormData()
      formData.append('product_id', this.product_id)
      formData.append('supplier_id', this.supplier_id)
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
