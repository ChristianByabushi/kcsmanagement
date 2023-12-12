<template>
  <div class="mx-auto mt-4 pa-6" ml-4 max-width="900px">
    <h2>Search</h2>

    <p>Search item : {{ query }}</p>

    <div align="center">
      <ProduxBox
        v-for="product in products"
        :key="product.id"
        :product="product"
      >
      </ProduxBox>
      <v-alert v-if="products.length == 0" width="50%" type="dark"
        >Nothing found</v-alert
      >
    </div>
  </div>
</template>

<script>
import ProduxBox from "@/components/ProductBox.vue";
import axios from "axios";
export default {
  name: "Search",
  components: { ProduxBox },
  data: () => ({
    products: [],
    query: "",
  }),
  mounted() {
    document.title = "Search |" + "KCS";
    let url = window.location.search.substring(1);
    let params = new URLSearchParams(url);
    if (params.get("query")) {
      this.query = params.get("query");
      this.performedSearch();
    }
  },
  methods: {
    async performedSearch() {
      this.$store.commit("setIsLoading", true);
      await axios
        .post("/api/v1/products/search/", {
          query: this.query,
        })
        .then((response) => {
          this.products = response.data;
          console.log(response.data);
        })
        .catch((error) => {
          console.log(response.data);
        })
        .finally(this.$store.commit("setIsLoading", false));
    },
  },
};
</script>
