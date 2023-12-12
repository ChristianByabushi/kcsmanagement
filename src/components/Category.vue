<template>
  <div align="center">
    <v-card justify="center" class="mx-auto mt-10">
      <v-card-title>
        <h2>{{ category.name }}</h2>
      </v-card-title>
    </v-card>
    <v-container fluid>
      <v-row dense>
        <ProductBox
          v-for="product in category.products"
          :key="product.id"
          :product="product"
        />
      </v-row>
    </v-container>
  </div>
</template>
<script>
import axios from "axios";
import ProductBox from "@/components/ProductBox.vue";
export default {
  name: "Category",
  components: {
    ProductBox,
  },
  data: () => ({
    category: {
      products: [],
    },
    categories: [],
  }),
  mounted() {
    // this.getCategory(); 
    this.getCategories()
  },

  methods: {
    
    async getCategory() {
      const category_slug = this.$route.params.category_slug;
      this.$store.commit("setIsLoading", true);

      await axios
        .get(`api/v1/products/${category_slug}/`)
        .then((response) => {
          this.category = response.data;
          document.title = this.category.name + " |KCS";
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
    },
  },
};
</script>
