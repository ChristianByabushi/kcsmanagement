<template>
  <div>
    <h3>Products</h3>

    <v-row>
      <v-col
        sm="6"
        md="4"
        v-for="product in $store.state.Products"
        :key="product.name"
      >
      </v-col>
    </v-row>
  </div>
</template>
