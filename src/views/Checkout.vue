<template>
  <div>
    <v-card
      class="mx-auto ma-4"
      :class="$vuetify.breakpoint.smAndDown ? 'max-width-sm' : 'max-width-lg'"
    >
      <v-card-title class="justify-center"> Place an order</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-simple-table class="mt-5">
          <template v-slot:default>
            <thead color="dark">
              <tr>
                <th class="text-left">Produit</th>
                <th class="text-left">Price</th>
                <th class="text-left">Quantity</th>
                <th class="text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart.items" :key="item.product.id">
                <td>{{ item.product.name }}</td>
                <td>{{ item.product.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ getItemTotal(item).toFixed(2) }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="d-block mt-4">
        <tfoot>
          <tr>
            <td colspan="3">
              Total cost :
              <strong class="mr-1"> ${{ cartTotalPrice.toFixed(2) }} </strong>
            </td>
            <td>for {{ cartTotalLength }} items</td>
          </tr>
        </tfoot>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-text class="mt-4">
        <h3 align="center" class="title mb-3">Shipping details</h3>
        <template>
          <v-form class="mb-3" ref="form" v-model="form">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="first_name"
                  :rules="rules.first_name"
                  label="First Name"
                  required
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="last_name"
                  :rules="rules.last_name"
                  label="Last Name"
                  required
                  outlined
                  dense
                ></v-text-field>

                <v-text-field
                  v-model="email"
                  :rules="rules.email"
                  label="E-mail"
                  required
                  outlined
                  dense
                ></v-text-field>

                <v-text-field
                  v-model="phone"
                  :rules="rules.phone"
                  label="Phone"
                  required
                  dense
                  outlined
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="adresse"
                  :rules="rules.adresse"
                  label="Adresse"
                  required
                  outlined
                  dense
                ></v-text-field>
                <v-text-field
                  v-model="zipcode"
                  :rules="rules.zipcode"
                  label="Zip code*"
                  required
                  dense
                  outlined
                ></v-text-field>
                <v-text-field
                  v-model="place"
                  :rules="rules.place"
                  label="Place"
                  required
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- <v-card  class="ma-0" dense>
              <v-card-text id="card-element-stripe"></v-card-text>
            </v-card> -->

            <v-checkbox
              v-model="checkbox"
              :rules="rules.checkbox"
              label="Do you agree?"
              required
            ></v-checkbox>

            <v-btn
              v-if="cartTotalLength"
              :disabled="!form"
              color="success"
              class="mr-4"
              @click="stripeTokenHandler()"
            >
              Send Command
            </v-btn>

            <v-btn color="error" class="mr-4" dense @click="reset">
              Reset Form
            </v-btn>
          </v-form>
        </template>

        <v-alert type="error" dense v-for="error in errors" :key="error">
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import router from "@/router";
import axios from "axios";
export default {
  name: "Checkout",
  data() {
    return {
      cart: {
        items: [],
      },
      stripe: {},
      card: {},
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      adresse: "",
      zipcode: "",
      place: "",
      errors: [],
      form: false,
      rules: {
        first_name: [(v) => !!v || "First name is required"],
        last_name: [(v) => !!v || "Last name is required"],
        checkbox: [(v) => !!v || "You must agree"],
        phone: [(v) => !!v || "Phone Number is required"],
        zipcode: [(v) => !!v || "First name is required"],
        place: [(v) => !!v || "Place is required"],
        email: [
          (v) => !!v || "E-mail is required",
          (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
        ],
      },
      checkbox: false,
    };
  },

  mounted() {
    document.title = "Checkout |KCS";
    this.cart = this.$store.state.cart;

    // if (this.cartTotalLength > 0) {
    //   this.stripe = Stripe(
    //     "pk_test_51H1HiuKBJV2qfWbD2gQe6aqanfw6Eyul5PO2KeOuSRlUMuaV4TxEtaQyzr9DbLITSZweL7XjK3p74swcGYrE2qEX00Hz7GmhMI"
    //   );

    //   const elements = this.stripe.elements();
    //   this.card = elements.create("card", {
    //     hidePostalCode: true,
    //   });
    //   this.card.mount("#card-element-stripe");
    // }
  },

  methods: {
    getItemTotal(item) {
      return parseFloat(item.quantity) + parseFloat(item.product.price);
    },

    submbitForm() {
      this.$refs.form.validate();
    },

    reset() {
      this.$refs.form.reset();
      this.$store.commit("setIsLoading", true);

      this.stripe.createToken(this.card).then((result) => {
        if (result.error) {
          this.$store.commit("setIsLoading", false);

          this.errors.push(
            "Something Went wrong with Stripe. Please try again"
          );

          console.log(result.error.message);
        } else {
          this.stripeTokenHandler(result.token);
        }
      });
    },

    async stripeTokenHandler(token) {
      this.errors = [];
      token = {
        id: 234,
      };
      const items = [];
      let i = 0;
      for (i = 0; i < this.cart.items.length; i++) {
        const item = this.cart.items[i];
        const obj = {
          price: item.product.price,
          quantity: item.quantity,
          product: item.product.id,
        };
        items.push(obj);
      }

      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        zipcode: this.zipcode,
        place: this.place,
        address: this.adresse,
        email: this.email,
        phone: this.phone,
        stripe_token: token.id,
        items: items,
      };
      
      this.$store.commit("setIsLoading", true);

      await axios
        .post("api/v1/checkout/", data)
        .then((response) => {
          router.push("/success");
        })
        .catch((error) => {
          this.errors.push("Something went wrong. Please try again");
          console.log(error);
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
    },
  },

  computed: {
    //this function iterates trough all the items cart  and have in parameter two arguments
    // one for storing result and the other considered as new item iterated! the result value or acc
    // is initiated to 0 at start.
    cartTotalLength() {
      return this.cart.items.reduce((acc, CurrentItem) => {
        return (acc += parseFloat(CurrentItem.quantity));
      }, 0);
    },

    cartTotalPrice() {
      return this.cart.items.reduce((acc, CurrentItem) => {
        return (acc += CurrentItem.product.price * CurrentItem.quantity);
      }, 0);
    },
  },
};
</script>

<style scoped>
.max-width-sm {
  max-width: 480px; /* Adjust the value to your desired maximum width for small screens */
}

.max-width-lg {
  max-width: 800px; /* Adjust the value to your desired maximum width for larger screens */
}
</style>
