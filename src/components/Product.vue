<template>
  <v-container>
    <v-row class="ma-5">
      <v-col cols="8">
        <v-card>
          <v-img :src="product.get_thumbnail" cover> </v-img>
          <v-card-title>{{ product.name }}</v-card-title>
          <v-divider></v-divider>
          <p class="ml-4">{{ product.description }}</p>
        </v-card>
      </v-col>

      <v-col cols="4">
        <h2 class="heading">Information</h2>
        <p><strong>Price :</strong> ${{ product.price }}</p>
        <v-row no-gutters>
          <v-col cols="12" md="3">
            <v-text-field
              label="Quantity"
              placeholder="Placeholder"
              v-model="quantity"
              type="number"
              step="1"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="3" offset-x="1">
            <v-btn dark @click="addToCart" fill-height class="mt-0" small>
              <v-icon density="compact">mdi-plus </v-icon>
              Add to cart</v-btn
            > 

            <messageDialog v-if="$store.state.isloading" />

            <v-snackbar
              v-model="toastVisible"
              bottom
              right
              :titemout="1000"
              color="dark"
            >
              Product {{ product.name }} added successfully
            </v-snackbar>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import messageDialog from "@/components/messageDialog.vue";

export default {
  name: "product",
  components: { messageDialog },
  data: () => ({
    product: [],
    toastVisible: false,
    quantity: 1,
    loading: false,
  }),
  mounted() {
    this.getProduct();
  },
  methods: { 
    
    showToast() {
      this.toastVisible = true;
    },

    async getProduct() {
      this.$store.commit("setIsLoading", true);

      const category_slug = this.$route.params.category_slug;
      const product_slug = this.$route.params.product_slug;
      await axios
        .get(`/api/v1/products/${category_slug}/${product_slug}`)
        .then((response) => {
          this.product = response.data;
          document.title = this.product.name + "| KCS";
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.$store.commit("setIsLoading", false);
        });
    },

    addToCart() {
      if (isNaN(this.quantity) || this.quantity < 1) {
        this.quantity = 1;
      }
      const item = {
        product: this.product,
        quantity: this.quantity,
      };
      this.$store.commit("addToCart", item);
      this.showToast();
    },
  },
};
</script>
