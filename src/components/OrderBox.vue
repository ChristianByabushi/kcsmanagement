<template>
  <v-card>
    <v-card-title class="justify-space-between"
      > <span> Order# {{ order.id }}  </span> 
      <span>({{ order.created_at }})</span></v-card-title
    >
    <v-simple-table>
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
          <tr v-for="item in order.items" :key="item.product.id">
            <td>{{ item.product.name }}</td>
            <td>{{ item.product.price }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ getItemTotal(item).toFixed(2) }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
export default {
  name: "OrderSummary",
  props: {
    order: Object,
  },

  methods: {
    getItemTotal(item) {
      return item.product.price * item.quantity;
    },

    orderTotalLength(order) {
      return order.items.reduce((acc, curVal) => {
        return (acc += curVal.quantity);
      });
    },
  },
};
</script>
