<template>
  <v-container>
    <v-row>
      <v-col sm="3" offset-lg="1">
        <Sidebar></Sidebar>
      </v-col>
      <v-col sm="9" lg="7">
        <ProductDisplay />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Sidebar from "@/components/Sidebar.vue";
import ProductDisplay from "@/components/ProductDisplay.vue";
export default {
  name: "Store",
  components: { Sidebar, ProductDisplay },
  data: () => ({}),
};
</script>
