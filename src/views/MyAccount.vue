<template>
  <div style="margin-bottom: 20rem" align="center" >
    <v-card
      elevation="1"
      justify="center"
      class="mt-4 ma-10"
    >
      <v-card-title class="mx-auto" align="center" >My Orders</v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-row>
          <OrderSummary
            class="ma-2"
            v-for="order in orders"
            :key="order.id"
            :order="order"
          >
          </OrderSummary>
        </v-row>
      </v-card-text>

      <!-- <v-card-actions>
        <v-btn small @click="logout()">Log out</v-btn>
      </v-card-actions> -->
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import OrderSummary from "@/components/OrderBox.vue";
export default {
  name: "myaccountcomponent",
  data() {
    return {
      orders: [],
    };
  },
  components: { OrderSummary },
  mounted() {
    document.title = "My Account | HumanAtm";
    this.getMyOrders();
  },
  methods: {
    async getMyOrders() {
      this.$store.commit("setIsLoading", true);
      await axios
        .get("/api/v1/orders/")
        .then((response) => {
          this.orders = response.data;
          console.log(this.orders)
        }) 
        .catch((errors) => {
          console.log(errors);
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
    },

    logout() {
     
    },
  },
};
</script>
