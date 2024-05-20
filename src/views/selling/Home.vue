<template>
  <div>
    <v-container>
      <template>
        <v-card>
          <v-toolbar color="extraMenu" dark flat>
            <v-toolbar-title>Selling</v-toolbar-title>
            <template v-slot:extension>
              <v-tabs class="d-flex justify-center" v-model="tab" align-with-title>
                <v-tabs-slider color="$vuetify.theme.dark ? 'extraMenu' : 'white'"></v-tabs-slider>
                <v-tab v-for="(item, index) in items" :key="index" :to="item.link">
                  {{ item.name }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tab">
            <v-tab-item value="orders">
              <v-card flat>
                <Orders></Orders>
              </v-card>
            </v-tab-item>
            <v-tab-item value="services">
              <v-card flat>
                <Services></Services>
              </v-card>
            </v-tab-item>
            <v-tab-item value="store">
              <v-card flat>
                <Store></Store>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import Orders from "@/views/orders/index.vue";
import Services from "@/views/services/index.vue";
import Store from "@/views/store/index.vue"
export default {
  name: "HomeSelling",
  data: () => ({
    latestProducts: [],
    fab: false,
    hidden: false,
    tabs: null,
    dialog: false,
    tab: null,
    items: [
      {
        name: "Orders",
        link: "orders",
      },
      {
        name: "Services",
        link: "services",
      },

      {
        name: "Store",
        link: "store",
      },
    ],
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  }),
  components: { Orders, Store, Services },

  mounted() {
    // this.getLastestProducts();
    document.title = "Selling" + "| KCS";
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
