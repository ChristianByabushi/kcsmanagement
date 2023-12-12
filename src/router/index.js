import Vue from "vue";
import VueRouter from "vue-router";
import Product from "../components/Product.vue";
import Category from "../components/Category.vue";
import Search from "../components/Search.vue";
import Signup from "../components/Signup.vue";
import Login from "../components/Login.vue";
import MyAccount from "../views/MyAccount.vue";
import Checkout from "../views/Checkout.vue";
import Success from "../components/Success.vue";
import store from "@/store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/dashboard/index.vue"),
    meta: {
      requireLogin: true,
    },
  },
  //selling
{
  path: "/selling",
  name: "selling", 
  component: () => import("@/views/selling/Home.vue"),
  children: [
    {
      path: "orders",
      name: "orders",
      component: () => import("@/views/orders/index.vue"),
    },
    {
      path: "payments",
      name: "payments",
      component: () => import("@/views/payments/index.vue"),
    },
    {
      path: "services",
      name: "services",
      component: () => import("@/views/services/index.vue"),
    },
    {
      path: "clients",
      name: "clients",
      component: () => import("@/views/clients/index.vue"),
    },
    {
      path: "reports",
      name: "reports",
      component: () => import("@/views/reports/index.vue"),
    },
  ],
  meta: {
    requireLogin: true,
  },

},
  //provisioning
  {
    path: "/provisioning",
    name: "provisioning",
    component: () => import("@/views/provisioning/Home.vue"),
    children: [
      {
        path: "categories",
        name: "categories",
        component: () => import("@/views/categories/index.vue"),
      },
      {
        path: "purchases",
        name: "purchases",
        component: () => import("@/views/purchases/index.vue"),
      },
      {
        path: "products",
        name: "products",
        component: () => import("@/views/products/index.vue"),
      },
      {
        path: "suppliers",
        name: "suppliers",
        component: () => import("@/views/suppliers/index.vue"),
      },
    ],
    meta: {
      requireLogin: true,
    },
  },

  // {
  //   path: "/approvisionnement",
  //   name: "approvisionnement",
  //   component: Product,
  //   meta: {
  //     requireLogin: true,
  //   },
  // },

  {
    path: "/my-account",
    name: "MyAccount",
    component: MyAccount,
    meta: {
      requireLogin: true,
    },
  },

  {
    path: "/Success",
    name: "Sucess",
    component: Success,
    meta: {
      requireLogin: true,
    },
  },

  {
    path: "/shop",
    name: "Shop",
    component: () => import("@/components/Shop.vue"),
    meta: {
      requireLogin: true,
    },
  },

  {
    path: "/cart",
    name: "cart",
    component: () => import("@/components/Card.vue"),
    meta: {
      requireLogin: true,
    },
  },

  {
    path: "/cart/checkout",
    name: "Checkout",
    component: Checkout,
    meta: {
      requireLogin: true,
    },
  },

  {
    path: "/Search",
    name: "Search",
    component: Search,
    meta: {
      requireLogin: true,
    },
  },

  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/infoadmin",
    name: "infoadmin",
    component: Login,
  },

  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },

  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  // {
  //   path: "/:category_slug",
  //   name: "Category",
  //   component: Category,
  //   meta: {
  //     requireLogin: true,
  //   },
  // },

  // {
  //   path: "/:category_slug/:product_slug",
  //   name: "Product",
  //   component: Product,
  //   meta: {
  //     requireLogin: true,
  //   },
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  //was for me a requirement so that it may work
  if (to.matched.some((record) => record.meta.requireLogin)) {
    // Check if the user is authenticated
    if (localStorage.getItem("token")) {
      // User is authenticated, allow them to proceed to the route
      next();
    } else {
      // User is not authenticated, redirect them to the login page
      next({ name: "login", query: { to: to.path } });
    }
  } else {
    // Route does not require authentication, allow the navigation
    next();
  }
});

export default router;
