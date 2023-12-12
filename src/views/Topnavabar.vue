<template>
  <div>
    <v-toolbar dense dark>
      <v-toolbar-title>
        <router-link class="white--text" style="text-decoration: none" to="/">
          <span class="hidden-sm-and-up">KCS</span>
          <span class="hidden-xs-only">Kivu Consulting Sevice </span>
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-col cols="8" sm="4" lg="4">
        <v-form method="get" action="/search" class="ml-1 mt-6">
          <v-text-field
            append-icon="mdi-magnify"
            placeholder="Search"
            rounded
            outlined
            dense
            name="query"
          >
          </v-text-field>
        </v-form>
      </v-col>

      <v-spacer></v-spacer>

      <span class="hidden-sm-and-up">
        <v-icon large @click.stop="drawer = !drawer"> mdi-menu </v-icon>
      </span>

      <v-toolbar-items class="hidden-xs-only">
        <v-btn text to="/summer" class="ml-2 text-center"> Summer </v-btn>
        <v-btn text to="/winter" class="ml-2"> Winter </v-btn>
        <v-btn text to="/cart" class="ml-2">
          <v-icon small left>mdi-basket</v-icon> Cart
          <span class="white--text">({{ cartTotalLength }})</span>
        </v-btn>

        <v-btn
          text
          to="/login"
          class="ml-2"
          v-if="!$store.state.isAuthenticated"
        >
          <v-icon small left>mdi-login</v-icon> Login
        </v-btn>
        <v-menu offset-y v-else>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>
          <v-list width="20rem">
            <v-list-item
              v-for="item in menuItems"
              :key="item.title"
              @click="handleMenuItemClick(item)"
            >
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer dark absolute v-model="drawer" temporary right>
      <v-img
        src="@/assets/logo.png"
        height="150px"
        class="align-end"
        cover
      ></v-img>
      <v-divider></v-divider>
      <v-list>
        <v-list-item to="/summer">
          <v-list-item-icon>
            <v-icon>mdi-basket</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="pa-0">Summer</v-list-item-content>
        </v-list-item>
        <v-list-item to="/winter">
          <v-list-item-icon>
            <v-icon>mdi-shopping</v-icon>
          </v-list-item-icon>
          <v-list-item-content>Winter</v-list-item-content>
        </v-list-item>

        <v-list-item to="/cart">
          <v-list-item-icon>
            <v-icon>mdi-basket</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Cart</v-list-item-content>
          <span class="white--text">({{ cartTotalLength }})</span>
        </v-list-item>

        <v-list-item to="/about">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content> About</v-list-item-content>
        </v-list-item>

        <v-list-item to="/my-account" v-if="$store.state.isAuthenticated">
          <v-list-item-icon>
            <v-icon>mdi-clipboard-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                  <v-icon>mdi-account-circle</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="item in menuItems"
                  :key="item.title"
                  @click="handleMenuItemClick(item)"
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/login" v-else>
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-content> Login</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.custom-icon {
  color: red;
  padding-left: 0;
  margin-left: 0;
}
.name_webiste_toobar {
  font-size: 32px;
  color: #4caf50;
  font-weight: 700;
  font-family: cursive;
}
</style>
<script>
import axios from "axios";
export default {
  name: "Topnavbar",
  data: () => ({
    drawer: "true",

    loaded: false,
    loading: false,
    cart: {
      items: [],
    },
    menuItems: [
      { title: "Profile", icon: "mdi-account", link: "profile/" },
      { title: "Settings", icon: "mdi-settings", link: "settings/" },
      { title: "Logout", icon: "mdi-logout", link: "logout/" },
    ],
    menus: [
      {
        title: "Summer",
        icon: "fa-shopping-basket",
        link: "shop",
      },
      {
        title: "Gallery",
        icon: "fa-shopping-basket",
        link: "gallery",
      },
      {
        title: "Contact",
        icon: "fa-shopping-basket",
        link: "contact",
      },
    ],
  }),
  created() {
    this.drawer = false;
  },
  mounted() {
    this.cart = this.$store.state.cart;
  },
  methods: {
    onClick() {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.loaded = true;
      }, 2000);
    },

    handleMenuItemClick(item) {
      if (item.title === "Profile") {
        this.$router.push("profile/");
      } else if (item.title === "Settings") {
        this.$router.push("settings/");
      } else if (item.title === "Logout") {
        axios.defaults.headers.common["Authorization"] = "";
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        localStorage.removeItem("cart");
        window.location.reload();
      }
    },
  },

  computed: {
    cartTotalLength() {
      let totalLength = 0;
      for (let i = 0; i < this.cart.items.length; i++) {
        totalLength += parseFloat(this.cart.items[i].quantity);
      }
      return totalLength;
    },
  },
};
</script>
