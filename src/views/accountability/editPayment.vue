<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="ma-1" elevation="2" color="indigo" icon outlined v-bind="attrs" v-on="on">
        <v-icon small> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="indigo">
        <span style="color: white;">
          EDIT PAYMENT OF THE ORDER #({{ OrderObject.id }})-PAY(#{{ payementItem.id }})
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row>
              <v-col cols="12">
                <h2 class="text-h6">Client : {{ OrderObject.customer.name }}</h2>
                <h3 class="text-h6">Cost of All the order : {{ OrderObject.total_amount }} ($)</h3>
                <h3 class="text-h6"> Amount already paid: {{ paidAmountOrder }} ($)</h3>
                <h3 class="text-h6">Date of the operation: {{ OrderObject.order_date }}</h3>
              </v-col>
              <v-col cols="6">
                <label for="amount_paid">Amount Payment to edit ($)</label>
                <v-text-field class="mt-0" :rules="[rules.required]" id="amount_paid" type="number"
                  v-model="amount_paid"></v-text-field>
              </v-col>
              <v-col cols="6">
                <label for="amount_remaining">The amount remaining ($)</label>
                <h2 class="mt-6 text-center" id="amount_remaining">{{ OrderObject.total_amount - amount_paid -
    paidAmountOrder }}</h2>
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
        <v-btn :loading="loadingButton" color="blue darken-1" text @click="editPayment()">
          Confirm Edit Pay.
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
  name: "editPayment",
  props: {
    OrderObject: Object,
    paidAmountOrder: 0,
    payementItem: Object,
  },

  data() {
    return {
      dialog: false,
      form: false,
      errors: [],
      amount_paid: this.payementItem.amount_paid,
      idOrder: this.OrderObject.id,
      loadingButton: false,
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
      if ((this.amount_paid === 0) || isNaN(amount_paid) == True) {
        this.erros.push('Error: the amount_paid musnt be equals to 0 or Nan')
        return false
      }
      return result
    },

    async editPayment() {
      this.loadingButton = true;
      this.errors = [];
      var result = true
      let amount_paid = parseFloat(this.amount_paid).toFixed(3)
      if ((amount_paid === 0) || isNaN(amount_paid) == true) {
        this.errors.push('Error: the total price musnt be equals to 0 or Nan')
        result = false
      }
      if (result == false) {
        this.loadingButton = false;
        return false
      }

      else {
        await axios
          .put(`kcs/api/payment-order/?id=${this.payementItem.id}`,
            {
              "amount_paid": this.amount_paid,
              "purchase_order_id": this.idOrder
            })
          .then((response) => {
            this.$emit("getOrderPayments");
            this.loadingButton = false;
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
