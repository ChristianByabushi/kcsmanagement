<template>
  <v-app-bar absolute app elevation="3">
    <v-app-bar-nav-icon @click="handDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title dense>
      <span v-if="$store.state.drawer == false">Kivu Consulting Service</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on" style="cursor: pointer" class="">
          <v-chip link>
            <v-badge dot bottom offset-y-x="10" color="inherit">
              <v-avatar size="50">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </v-badge>
            <div>
              <span> </span>
            </div>
          </v-chip>
        </span>
      </template> 

      <v-list width="250" class="py-0">
        <v-list-item two-line>
          <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg"> alt="error" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Jane Smith</v-list-item-title>
            <v-list-item-subtitle>Logged In</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="(menu, index) in menus"
          :key="index"
          link
          :to="{ name: menu.link }"
        >
          <v-list-item-icon>
            <v-icon>{{ menu.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content
            @click="menu.link == 'login' ? logout() : donothing()"
          >
            <v-list-item-title>
              {{ menu.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-switch class="pt-6 pl-3" v-model="$vuetify.theme.dark"></v-switch>
  </v-app-bar>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      menus: [
        { title: "Compte", icon: "mdi-account", link: "infoadmin" },
        { title: "Déconnexion", icon: "mdi-logout", link: "login" },
      ],
      items: [
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me" },
        { title: "Click Me 2" },
      ],
    };
  },
  methods: {
    handDrawer() {
      this.$store.commit("setDrawer");
    },
    changeLocale(lang) {
      console.log(lang);
      this.$vuetify.lang.current = lang;
    },
  },
};
</script>
