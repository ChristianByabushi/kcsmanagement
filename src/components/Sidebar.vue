<template>
  <v-navigation-drawer v-model="$store.state.drawer" app>
    <v-list-item>
      <v-list-item-icon>
        <v-img max-height="160" max-width="180" src="@/assets/kcs.jpg"> </v-img>
      </v-list-item-icon>
    </v-list-item>
    <v-divider></v-divider>
    <div>
      <v-list v-for="item in items" :key="item.title">
        <v-list-group v-model="item.active" :prepend-icon="item.action" no-action v-if="item.items.length > 0">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item v-for="child in item.items" :key="child.title" :to="{ name: child.link }">
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else :to="{ name: item.link }">
          <v-list-item-icon>
            <v-icon :color="$vuetify.theme.dark ? 'white' : 'primary'">{{
    item.action
  }}</v-icon>
          </v-list-item-icon>

          <v-list-item-title v-text="item.title"> </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from "vuex";
import { mapGetters } from "vuex";
export default {
  name: "Sidebar",
  data: () => ({
    linksAdmin: [
      ["mdi-microsoft-windows", "Dashboard", "#C51162", "dashboard"],
      ["mdi-account-cog", "Produits", "#9C27B0", "product"],
      ["mdi-chart-bar", "Stocks", "#60722B", "store"],
      ["mdi-chart-cog", "Facture", "#A0722B", "invoice"],
      ["mdi-chart-bar", "Suivi", "#60A22B", "monitoring"],
    ],
    items: [
      {
        action: "mdi-microsoft-windows",
        title: "dashboard",
        items: [],
        active: false,
        link: "dashboard",
      },
      {
        action: "mdi-silverware-fork-knife",
        link: "provisioning",
        active: false,
        items: [
          { title: "Purchases", link: "purchases" },
          { title: "Products", link: "products" },
          { title: "Categories", link: "categories" },
          { title: "Suppliers", link: "suppliers" },
        ],
        title: "Provisionning",
      },
      {
        action: "mdi-home",
        link: "selling",
        active: false,
        items: [
          { title: "Orders", link: "orders" },
          { title: "Services", link: "services" },
          { title: "Store", link: "store" },
        ],
        title: "Selling",
      },
      {
        action: "mdi-basket",
        link: "accountability",
        active: false,
        items: [
          { title: "Payments", link: "payments" },
          { title: "Clients", link: "clients" },
        ],
        title: "Acountability",
      },

      // {
      //   action: "mdi-human-male-female-child",
      //   link: "",
      //   items: [{ title: "List Item" }],
      //   title: "Family",
      // },
      // {
      //   action: "mdi-bottle-tonic-plus",
      //   items: [{ title: "List Item" }],
      //   title: "Health",
      //   link: "",
      // },
      // {
      //   action: "mdi-briefcase",
      //   items: [{ title: "List Item" }],
      //   title: "Office",
      // },
      // {
      //   action: "mdi-tag",
      //   items: [{ title: "List Item" }],
      //   title: "Promotions",
      //   link: "",
      // },
    ],
  }),
  methods: {
    logout() {
      localStorage.removeItem("token");
    },
    donothing() { },
  },
  computed: {
    ...mapGetters(["getDrawer"]),
    ...mapState(["userInfo"]),
  },
};
</script>
<style scoped></style>
