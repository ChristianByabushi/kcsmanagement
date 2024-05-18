<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="ma-1" elevation="2" color="primary" icon outlined v-bind="attrs" v-on="on">
        <v-icon small> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h6">EDIT ORDER ITEM #({{ OrderItemObject.id }})</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row>
              <v-col cols="12">
                <h2 class="text-h6">{{ OrderItemObject.product.name.toUpperCase() }}</h2>
              </v-col>
            </v-row>
            <v-row cols="12">
              <v-col cols="4">
                <v-text-field type="number" label="Unit Price" v-model="unit_price">
                </v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field type="number" label="Quantity" v-model="quantity">
                </v-text-field>
              </v-col>
              <v-col cols="4" class="mt-0">
                <label for="totalPriceItem">Total price Item :</label>
                <h3 id="totalPriceItem">
                  {{ (unit_price * quantity).toFixed(3) }} $
                </h3>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <small>*indicates required field</small>
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
        <v-btn :loading="loadingButton" color="blue darken-1" text @click="editOrderItem()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
  name: "editOrderItem",
  props: {
    OrderItemObject: Object,
  },

  data() {
    return {
      dialog: false,
      form: false,
      errors: [],
      unit_price: this.OrderItemObject.unit_price,
      quantity: this.OrderItemObject.quantity,
      loadingButton: false,
      id: this.OrderItemObject.id,
      rules: {
        required: (v) => !!v || " This field is required",
      },
    };
  },

  methods: {
    removeAddDialog() {
      this.dialog = false;
      this.loadingButton = false;
      this.errors = [];
    },

    checkIfNotNull() {
      let result = true
      totalPrice = this.quantity * this.unit_price
      if ((totalPrice === 0) || isNaN(totalPrice) == True) {
        this.erros.push('Error: the total price musnt be equals to 0 or Nan')
        return false
      }

      if (this.quantity == NaN || this.quantity < 0 || this.quantity == undefined) {
        this.errors.push("Error Quantity:The quantity musn\'t be null or lower than 0")
        result = false
      }


      if (this.unit_price == NaN || this.unit_price == undefined) {
        this.errors.push("Error Unit Price:The unit musn\'t be null")
        result = false
      }
      return result
    },

    async editOrderItem() {
      this.loadingButton = true;
      this.errors = [];
      var result = true
      this.unit_price = parseFloat(this.unit_price).toFixed(3)
      this.quantity = parseFloat(this.quantity).toFixed(3)
      var totalPrice = this.quantity * this.unit_price
      if ((totalPrice === 0) || isNaN(totalPrice) == true) {
        this.errors.push('Error: the total price musnt be equals to 0 or Nan')
        result = false
      }
      if (this.quantity == NaN || this.quantity <= 0 || this.quantity == undefined) {
        this.errors.push("Error Quantity:The quantity musn\'t be null or lower than 0")
        result = false
      }

      if (this.unit_price == NaN || this.unit_price == undefined) {
        this.errors.push("Error Unit Price:The unit musn\'t be null")
        result = false
      }

      if (result == false) {
        this.loadingButton = false;
        return false
      }

      else {
        await axios
          .put(`kcs/api/order-item/${this.id}/?unit_price=${this.unit_price}&quantity=${this.quantity}`)
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
