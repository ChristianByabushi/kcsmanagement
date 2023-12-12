<template>
  <tr>
    <td>
      <router-link class="custom-link" to="item.product.get_absolute_url">{{
        item.product.name
      }}</router-link>
    </td>
    <td>{{ item.product.price }}</td>
    <td>
      ${{ item.quantity }} <br>
      <v-btn
        @click="decrementQuantity(item)"
        class="ml-1"
        fab
        style="width: 16px; height: 16px; padding: 4px;" 
        color="primary"
        elevation="0"
      >
        <v-icon dark> mdi-minus </v-icon>
      </v-btn>
      <v-btn
        @click="IncrementQuantity(item)"
        class="ml-1"
        fab
        style="width: 16px; height: 16px; padding: 4px;"
        color="primary"
        elevation="1"
      >
        <v-icon dark> mdi-plus </v-icon>
      </v-btn>
    </td>
    <td>{{ getItemTotal(item).toFixed(2) }}</td>
    <td @click="removeFromCart(item)"><v-icon small>mdi-delete</v-icon></td>
  </tr>
</template>

<script>
export default {
  name: "CardItem",
  props: {
    CardItemInfo: Object,
  },

  data() {
    return {
      item: this.CardItemInfo,
    };
  },

  methods: {
    getItemTotal(item) {
      return item.quantity * item.product.price;
    },

    decrementQuantity(item) {
      item.quantity -= 1;
      if (item.quantity === 0) {
        {
          //we cuse emit property to pass the item
          // to the componet to the parent

          //props and v-bind: is used when the parent passes the
          // element to child in the other hand emit and v-on:
          this.$emit("removeFromCart", item);
        }
      }
      this.updateCart();
    },

    IncrementQuantity(item) {
      item.quantity += 1;
      this.updateCart();
    },

    updateCart() {
      localStorage.setItem("cart", JSON.stringify(this.$store.state.cart));
    },

    removeFromCart(item) {
      this.$emit("removeFromCart", item);
      this.updateCart();
    },
  },
};
</script>

<style>
.custom-link {
  text-decoration: none;
}

.small-btn { 
  color: red;
  width: 2px;
  height: 2px;
  padding: 0;
}
</style>
