<template>
  <v-app>
    <loginVue v-if="$router.currentRoute == 'login'"> </loginVue>

    <loginVue v-if="$router.currentRoute == 'signin'"> </loginVue>

    <Header v-if="$route.path !== '/login'"></Header>
    <Sidebar v-if="$route.path !== '/login'"></Sidebar>
    <v-main>
      <messageDialog v-if="$store.state.loading"></messageDialog> 
      <IsLoadingData> </IsLoadingData>
      <router-view></router-view> 
    </v-main>
  </v-app>
</template>

<script>
import loginVue from "@/components/Login.vue";
import messageDialog from "@/components/messageDialog.vue";  
import IsLoadingData from "@/components/IsLoadingData.vue";
import Header from "@/components/header.vue";
import Sidebar from "@/components/Sidebar.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import store from "./store";
export default {
  name: "App",
  components: {Sidebar, IsLoadingData, messageDialog, Footer, Header },
  data: () => ({}),
  // this function is called when page is created, thus, every time
  beforeCreate() {
    this.$store.commit("initializeStore");
    const token = this.$store.state.token;
    //we have to get the token and put it in axios property
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Token " + token;
    } else {
      axios.defaults.headers.common["Authorization"] = "";
    }
  },
};
</script>
