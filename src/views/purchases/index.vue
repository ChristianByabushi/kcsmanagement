<template>
  <v-container pa-4>
    <v-card class="mt-2" elevation="2">
      <v-row no-gatthers>
        <v-col cols="3 md-6" class="pa-2 ml-2">
          <v-text-field class="mt-2 ml-3" v-model="searchFilter" append-icon="mdi-magnify" label="Search" dense
            outlined></v-text-field>
        </v-col>
        <v-col cols="3 md-6" class="pa-0 ma-0">
          <v-select class="mt-4 ml-3" outlined dense :items="products" item-value="id" item-text="name"
            v-model="selectedProduct" label="product"></v-select>
        </v-col>
        <v-col cols="3">
          <v-menu v-model="menu1" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field :value="computedDateFormattedMomentjs" clearable label="Specify the date" readonly
                v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
            </template>
            <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" class="mr-7" align="end">
          <addPurchase v-on:getPurchases="getPurchases"></addPurchase>
        </v-col>
      </v-row>
      <v-simple-table class="mt-0 ml-2">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                *
              </th>
              <th class="text-left">
                image
              </th>
              <th class="text-left">
                Name
              </th>
              <th class="text-left">
                unit_price
              </th>
              <th class="text-left">
                stock_quantity
              </th>
              <th class="text-left">
                total cost ($)
              </th>
              <th class="text-left">
                Date
              </th>
              <th class="text-left">
                Supplier
              </th>
              <th class="text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <v-img v-if="item.product.image !== null" cover height="50" width="50" :src="item.product.image" alt="">
                </v-img>
                <v-img v-else>
                  not found
                </v-img>
              </td>
              <td>{{ item.product.name }}</td>
              <td>{{ item.unit_price }}</td>
              <td>{{ item.stock_quantity }}</td>
              <td>{{ totalCost(item.unit_price, item.stock_quantity) }}</td>
              <td>{{ dataConvert(item.created_at) }}</td>
              <td>{{ supplierResolveNull(item) }}</td>
              <td>
                <editPurchase :PurchaseObjectFromParent="computedBuildingValues(item)" v-on:getPurchases="getPurchases">
                </editPurchase>
                <deletePurchase :PurchaseObjectFromParent="computedBuildingValues(item)" v-on:getPurchases="getPurchases">
                </deletePurchase>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <template>
        <div class="text-justify mt-2 ml-0">
          <v-row class="ma-0">
            <v-col cols="4" class="mt-2">
              ($) Total : {{ countTotalPrice.toFixed(3) }}
            </v-col>
            <v-col cols="3">
              <v-pagination v-model="page" :length="NumberOfPage" circle></v-pagination>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="2">
              <v-select :items="itemsPrint" v-model="page_size" label="Row per page"></v-select>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-card>
  </v-container>
</template>

<script>
import addPurchase from "../purchases/addPurchase.vue";
import editPurchase from "../purchases/editPurchase.vue";
import deletePurchase from "../purchases/deletePurchase.vue";
import axios from "axios";
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
  components: {  editPurchase, deletePurchase },
  data() {
    return {
      purchases: [],
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      menu1: false,
      menu2: false,
      search: "",
      products: [],
      searchFilter: "",
      dialog: false,
      selectedProduct: null,
      page: 1,
      count: 0,
      page_size: 2,
      itemsPrint: [2, 5, 10, 15, "All"],
    };
  },

  computed: {

    countTotalItems() {
      return this.purchases.length
    },
    countTotalPrice() {
      return this.purchases.reduce((acc, curVal) => {
        return acc += curVal.unit_price * curVal.stock_quantity
      }, 0.)
    },
    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
    },
    computedDateFormattedDatefns() {
      return this.date ? format(parseISO(this.date), 'EEEE, MMMM do yyyy') : ''
    },
    NumberOfPage() {
      return Math.ceil(this.count / this.page_size);
    },
    filteredItems() {
      let filtered = this.purchases
      const query = this.searchFilter.toLowerCase().trim()

      // Filter by selected category if present
      if (this.selectedProduct !== null) {
        filtered = filtered.filter(item =>
          item.product.id === this.selectedProduct
        );
      }

      if (query) {
        return this.purchases.filter((item) =>
          item.product.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
      }

      return filtered;
    }

  },

  //most used when the property changes for calling the api
  watch: {
    page: {
      handler() {
        this.getPurchases();
      },
      //this property will mount the categories
      immediate: true,
    },

    page_size: {
      handler() {
        this.getPurchases();
      },
    },

    date: {
      handler() {
        this.getPurchases()
      }
    },
    search: function (newValue, olValue) {
      this.getPurchases();
    },

  },

  async mounted() {
    this.getProducts()
  },
  methods: {
    computedBuildingValues(item) {
      if (item.supplier == null) {
        item.supplier = {
          'id': null,
          'name': 'supplier not provided'
        }
      }
      return item
    },
    supplierResolveNull(item) {
      if (item.supplier !== null)
        return item.supplier.name
      else
        "supplier not provided"

    },
    totalCost(unitprice, stock_quantity) {
      let total = 0
      total = unitprice * stock_quantity
      return total.toFixed(3)
    },
    dataConvert(value) {
      return new Date(value)
    },

    async getProducts() {
      await axios
        .get(`kcs/api/products/`)
        .then((response) => {
          this.products = response.data
          this.products.push({
            'id': null,
            'name': "All products"
          })
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getPurchases() {
      if (this.search === "") {
        this.$store.commit("setIsLoadingData", true);
      }
      let pagination = ``;
      let search = ``;
      if (this.page_size === "All") {
        this.page_size = this.count;
      } else {
        pagination = `?created_at=${this.date}&page=${this.page}&page_size=${this.page_size}`;
      }

      if (this.search != "") {
        search = `&search=${this.search}`;
      }

      await axios
        .get(`kcs/api/products-purchased/${pagination}${search}`)
        .then((response) => {
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
          // anticipate the django return
          if (response.data.results) {
            this.count = response.data.count;
            response.data = response.data.results;
          }
          setTimeout(() => (this.purchases = response.data), 800);
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
        });
    },
  },
};
</script>
