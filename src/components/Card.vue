<template>
  <div align="center">
    <v-card class="mt-4 ma-10" max-width="900px">
      <v-card-title class="justify-center">
        Products in the Basket</v-card-title
      >
      <v-divider></v-divider> 
      
      <v-card-text v-if="cartTotalLength">
        <v-simple-table height="400px" class="mt-5">
          <template v-slot:default>
            <thead color="dark">
              <tr>
                <th class="text-left">Produit</th>
                <th class="text-left">Price</th>
                <th class="text-left">Quantity</th>
                <th class="text-left">Total</th>
                <th class="text-left"><v-icon>mdi-edit</v-icon></th>
              </tr>
            </thead>
            <tbody>
              <CardItem
                v-for="item in cart.items"
                :key="item.product.id"
                :CardItemInfo="item"
                v-on:removeFromCart="removeFromCart"
              ></CardItem>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>

      <v-card-text v-else>
        <v-alert type="info" color="dark"> Nothing present yet </v-alert>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="d-block">
        Total cost : <strong>${{ cartTotalPrice.toFixed(2) }}</strong>
        <div>for {{ cartTotalLength }} Items</div>
        <v-btn dark>
          <router-link class="white--text" to="/cart/checkout"
            >Proceed to checkout</router-link
          >
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
u

<script>
import CardItem from "@/components/CardItem.vue";
export default {
  name: "Card",
  components: { CardItem },
  data() {
    return {
      cart: {
        items: [],
      },
    };
  }, 
  
  mounted() {
    document.title = "Products || KCS";
    this.cart = this.$store.state.cart; // as the object it becomes cart if my store
    // its means that if i modify cart, store cart is too
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
        return (acc += parseFloat(CurrentItem.product.price * CurrentItem.quantity));
      }, 0);
    },
  },
  methods: {
    //methoded performed from card Item emit
    // the functions compares all my items cart and whatever product id is diffrent from the in item.product.id
    // Its returned; its operation of removing the invaded, ahahhaha!
    removeFromCart(item) {
      this.cart.items = this.cart.items.filter(
        (i) => i.product.id !== item.product.id
      );
    },
  },
};
</script>
