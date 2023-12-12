import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cart: {
      items: [],
    },
    isAuthenticated: false,
    token: "",
    isloading: false,
    isloadingData: false,
    drawer: true,
  },

  mutations: {
    initializeStore(state) {
      if (localStorage.getItem("cart")) {
        state.cart = JSON.parse(localStorage.getItem("cart"));
      } else {
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
      if (localStorage.getItem("token")) {
        state.token = localStorage.getItem("token");
        state.isAuthenticated = true;
      } else {
        state.token = "";
        state.isAuthenticated = false;
      }
    },

    setDrawer(state) {
      state.drawer = !state.drawer;
    },

    addToCart(state, item) {
      //this function return all items which are equals to the product id
      const exists = state.cart.items.filter(
        (i) => i.product.id === item.product.id
      );

      if (exists.length) {
        exists[0].quantity = parseDouble(
          exists[0].quantity + parseFloat(item.quantity)
        );
      } else {
        state.cart.items.push(item);
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    setIsLoading(state, status) {
      state.isloading = status;
    },

    setIsLoadingData(state, status) {
      state.isloadingData = status;
    },

    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
    },

    removeToken(state) {
      state.token = "";
      state.isAuthenticated = false;
    },

    cleanCart(state) {
      state.cart = { items: [] };
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },

  actions: {},
  modules: {},
});
