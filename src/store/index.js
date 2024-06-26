import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cart: {
      items: [],
    }, 
    orderItems:[],  
    servicesOrderItems:[],   
    Allcategories:[],
    customers:[],
    Allproducts:[], 
    isAuthenticated: false,
    token: "",
    isloading: false,
    isloadingData: false,
    drawer: true, 
  },

  // Like computers, getters properties handle the calculation on state variables
  getters:{
    products : state => state.Allproducts,
    categories : state => state.Allcategories,
    orderItems : state => state.orderItems,  
    servicesOrderItems:state => state.servicesOrderItems,
    customers : state => state.customers, 
    cartTotalPrice: state=> {
      return state.orderItems.reduce((acc, cartItem) => {
        return (
              parseFloat(cartItem.unit_price) * parseFloat(cartItem.quantity)) + acc;
        }, 0).toFixed(2);
        
    },

    cartServiceTotalPrice:    state=> {
      return state.servicesOrderItems.reduce((acc, cartServiceItem) => {
        return (
              parseFloat(cartServiceItem.total_price)) + acc;
        }, 0).toFixed(2);
        
    }, 

    listOfProductsRemains: state=> {  
      var currentproducts = state.Allproducts
        state.orderItems.forEach(productOnOrderId => {
          currentproducts = currentproducts.filter(i => i.id !== productOnOrderId.product_id)
        }); 
      return currentproducts 
    },

    listOfCategoriesRemaining: state=> {  
      var currentCategories = state.Allcategories
        state.servicesOrderItems.forEach(CategoryOnOrder => {
          currentCategories = currentCategories.filter(i => i.id !== CategoryOnOrder.category_id)
        }); 
      return currentCategories 
    },
  },

  // the mutations are concerned by the instanciation of values in state properties
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

    UPDATE_PRODUCT_ITEMS(state, payload){
        state.Allproducts = payload  
    }, 
  
    UPDATE_CLIENTS(state, payload){
        state.customers = payload
    }, 

    UPDATE_CATEGORIES(state, payload){
      state.Allcategories = payload
  }, 

    initializeOrder(state){
      state.orderItems=[]
    } ,

    initializeServiceOrder(state){
      state.servicesOrderItems=[]
    } ,

    removeOrderItem(state, indexItemToremove) { 
      state.orderItems = state.orderItems.filter( 
        (item, index) => index !== indexItemToremove
      ); 
    },
    
    removeServiceOrderItem(state, indexItemToremove) { 
      state.servicesOrderItems = state.servicesOrderItems.filter( 
        (item, index) => index !== indexItemToremove
      ); 

    },
      updateItem(state, updateItemObject) {  
      const { index, pu, qty, product_id } = updateItemObject;   
       state.orderItems.forEach((element, indexOfParent) => {
        if(index==indexOfParent){
          element.quantity=qty
          element.unit_price=pu
          element.product_id=product_id
        }
      });
   }, 

   updateServiceItem(state, updateServiceItemObject) {  
    const { index,category_id, description, total_price } = updateServiceItemObject;   
     state.servicesOrderItems.forEach((element, indexOfParent) => {
      if(index==indexOfParent){
        element.description=description
        element.total_price=total_price 
        element.category_id=category_id 
      }
    });
 },

    addOrderItem(state) { 
        state.orderItems.push(
          {
            unit_price: 0,
            quantity: 0,
            product_id: 0
          }
        )
    },

    addServiceOrderItem(state) { 
        state.servicesOrderItems.push(
          {
            description: '',
            total_price: 0, 
            category_id:null
          }
        )
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

  // Are concerned by the interactity with the application interface.
  actions: {
    async getProducts({commit}) {
      await axios
        .get(`kcs/api/products/`)
        .then((response) => {
          commit('UPDATE_PRODUCT_ITEMS', response.data)
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCustomers({commit}) {
      await axios
        .get(`kcs/api/customers/`)
        .then((response) => {
          commit('UPDATE_CLIENTS', response.data) 
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getCategories({commit}) {
      await axios
        .get(`kcs/api/categories/`)
        .then((response) => { 
          commit('UPDATE_CATEGORIES', response.data) 
        })
        .catch((error) => {
          console.log(error);
        });
    },

  },
  modules: {},
});
