<template>
  <v-col cols="12" md="6">
    <v-card>
      <v-img
        :src="product.get_thumbnail"
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="200px"
        cover
      >
        <v-card-title class="white--text">{{ product.name }}</v-card-title>
        <p class="ml-5 white--text">{{ product.price }}$</p>
      </v-img>

      <v-card-actions>
        <v-spacer></v-spacer>
        <span>View details</span>
        <v-btn
          size="small"
          color="surface-variant"
          :to="product.get_absolute_url"
          text
        >
          <v-icon> mdi-share </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "ProductBox",
  props: {
    product: Object,
  },
};
</script>
