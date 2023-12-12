<template>
  <div>
    <v-container>
      <template>
        <v-card>
          <v-toolbar color="primaryMenu" dark flat>
            <v-toolbar-title>Provisionning</v-toolbar-title>
            <template v-slot:extension>
              <v-tabs class="d-flex justify-center" v-model="tab" align-with-title>
                <v-tabs-slider color="$vuetify.theme.dark ? 'primaryMenu' : 'white'"></v-tabs-slider>
                <v-tab v-for="(item, index) in items" :key="index" :to="item.link">
                  {{ item.name }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tab">
            <v-tab-item value="purchases">
              <v-card flat>
                <Purchases></Purchases>
              </v-card>
            </v-tab-item>
            <v-tab-item value="products">
              <v-card flat>
                <products></products>
              </v-card>
            </v-tab-item>
            <v-tab-item value="categories">
              <v-card flat>
                <Categorie></Categorie>
              </v-card>
            </v-tab-item>
            <v-tab-item value="suppliers">
              <v-card flat>
                <Suppliers></Suppliers>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>
    </v-container>
    <!-- 
    <div class="text-center">
      <v-btn
        :disabled="dialog"
        :loading="dialog"
        class="white--text"
        color="purple darken-2"
        @click="dialog = true"
      >
        Start loading
      </v-btn>

    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import ProductBox from "@/components/ProductBox.vue";
import Categorie from "@/views/categories/index.vue";
import Purchases from "@/views/purchases/index.vue";
import products from "@/views/products/index.vue";
import Suppliers from "@/views/suppliers/index.vue"
export default {
  name: "HomeProvisionning",
  data: () => ({
    latestProducts: [],
    fab: false,
    hidden: false,
    tabs: null,
    dialog: false,
    tab: null,
    items: [
      {
        name: "Purchases",
        link: "purchases",
      },
      {
        name: "Products",
        link: "products",
      },
      {
        name: "Categories",
        link: "categories",
      },
      {
        name: "Suppliers",
        link: "suppliers",
      },
    ],
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  }),
  components: { ProductBox, Purchases, Suppliers, Categorie, products },

  mounted() {
    // this.getLastestProducts();
    document.title = "Provisionning" + "| KCS";
  },

  watch: {
    dialog(val) {
      if (!val) return;
      setTimeout(() => (this.dialog = false), 2000);
    },
  },

  computed: {
    activeFab() {
      switch (this.tabs) {
        case "one":
          return { color: "success", icon: "mdi-share-variant" };
        case "two":
          return { color: "red", icon: "mdi-pencil" };
        case "three":
          return { color: "green", icon: "mdi-chevron-up" };
        default:
          return {};
      }
    },
  },

  methods: {},
};
</script>
