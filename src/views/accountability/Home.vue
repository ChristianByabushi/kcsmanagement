<template>
  <div>
    <v-container>
      <template>
        <v-card>
          <v-toolbar color="#303f9f" dark flat>
            <v-toolbar-title>Accountability</v-toolbar-title>
            <template v-slot:extension>
              <v-tabs class="d-flex justify-center" v-model="tab" align-with-title>
                <v-tabs-slider color="$vuetify.theme.dark ? '#303f9f' : 'white'"></v-tabs-slider>
                <v-tab v-for="(item, index) in items" :key="index" :to="item.link">
                  {{ item.name }}
                </v-tab>
              </v-tabs>
            </template>
          </v-toolbar>

          <v-tabs-items v-model="tab">
            <v-tab-item value="payments">
              <v-card flat>
                <Payments></Payments>
              </v-card>
            </v-tab-item>
            <v-tab-item value="clients">
              <v-card flat>
                <Clients></Clients>
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
import Clients from "@/views/clients/index.vue";
import Payments from "@/views/accountability/payments.vue"
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
        name: "Payments",
        link: "payments",
      },
      {
        name: "Clients",
        link: "clients",
      },

    ],
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  }),
  components: { Payments, Clients },

  mounted() {
    // this.getLastestProducts();
    document.title = "Accountability" + "| KCS";
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
