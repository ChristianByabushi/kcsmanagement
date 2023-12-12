<template>
  <v-card outlined>
    <v-img :src="product.image" height="200px"></v-img>

    <v-card-title>{{ product.name }}</v-card-title>
    <v-card-subtitle>${{ product.price }}</v-card-subtitle>

    <v-card-actions>
      <v-btn @click="addTocart" color="success" outlined></v-btn>
      <v-icon small left>fa-plus</v-icon>
      Add to Cart
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
    props:{
        product:Object,
        addToCart: Function
    },
};
</script>
