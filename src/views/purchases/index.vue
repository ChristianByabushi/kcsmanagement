<template>
  <v-container pa-4>
    <v-card class="mt-2" elevation="2">
      <v-row no-gatthers >
        <v-col cols="3 md-6" class="pa-0 ma-0 ml-2">
          <v-select class="mt-4 ml-3" outlined dense :items="products" clearable item-value="id" item-text="name"
            v-model="selectedProduct" label="Product"></v-select>
        </v-col>
        <v-col cols='3' class="mt-3 ml-4">
          <v-menu v-model="menu1" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense small :value="computedDateFormattedMomentjs" clearable label="From" readonly
                v-bind="attrs" v-on="on" @click:clear="date = null"></v-text-field>
            </template>
            <v-date-picker v-model="date" @change="menu1 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols='3'>
          <v-menu v-model="menu2" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field dense small class="mt-4" :value="computedDateFormattedMomentjsForDateTo" clearable
                label="To" readonly v-bind="attrs" v-on="on" @click:clear="dateto = null"></v-text-field>
            </template>
            <v-date-picker v-model="dateto" @change="menu2 = false"></v-date-picker>
          </v-menu>
        </v-col>

        <v-spacer>
        </v-spacer>
        <v-col cols="2" class="mr-7" align="end">
          <addPurchase v-on:getPurchases="getPurchases"></addPurchase>
        </v-col>
      </v-row>

      <v-simple-table class="mt-0 ml-2" v-if="typeItem == 'Purchases'">
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
                <v-img v-if="item.product.get_image !== null" cover height="50" width="50" :src="item.product.get_image"
                  alt="">
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
                <deletePurchase :PurchaseObjectFromParent="computedBuildingValues(item)"
                  v-on:getPurchases="getPurchases">
                </deletePurchase>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-simple-table class="mt-0 ml-2" v-else>
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
                TotalQty
              </th>
              <th class="text-left">
                QtySold
              </th>
              <th class="text-left">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in results" :key="item.id">
              <td>{{ item.id }}</td>
              <td>
                <v-img v-if="item.product.get_image !== null" cover height="50" width="50" :src="item.product.get_image"
                  alt="">
                </v-img>
                <v-img v-else>
                  not found
                </v-img>
              </td>
              <td>{{ item.product.name }}</td>
              <td>{{ item.totalQty }}</td>
              <td>{{ item.quantitySold }}</td>
              <td>{{ item.totalQty - item.quantitySold }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>


      <template>
        <div class="text-justify mt-2 ml-0">
          <v-row class="ma-0" style="border-top: indigo 1px solid;">
            <v-col cols="3" class="mt-2" v-if="typeItem == 'Purchases'">
              ($) CostOfAllTotal :
              <div>
                {{ countTotalPrice.toFixed(3) }}
              </div>
            </v-col>
            <v-col cols="3" class="mt-2" v-else>
              <div>AllTotalQuantity : {{ countTotalQty.toFixed(3) }}</div>
              <div>AllTotalSold : {{ countTotalQtySold.toFixed(3) }}</div>
              <div>AllRemaining : {{ countRemaining.toFixed(3) }} </div>
            </v-col>

            <v-spacer></v-spacer>

            <v-col cols="3">
              <v-pagination v-model="page" :length="NumberOfPage" circle></v-pagination>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="4">
              <v-row>
                <v-col cols="6">
                  <v-select :items="typeItems" v-model="typeItem" label="Type List"></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select :items="itemsPrint" v-model="page_size" label="Row per page"></v-select>
                </v-col>
              </v-row>
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
  components: { editPurchase, deletePurchase, addPurchase },
  data() {
    return {
      purchases: [],
      menu1: false,
      menu2: false,
      search: "",
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      dateto: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      products: [],
      searchFilter: "",
      dialog: false,
      selectedProduct: null,
      page: 1,
      count: 0,
      page_size: 2,
      itemsPrint: [2, 5, 10, 15, "All"],
      results: [],
      typeItem: "Purchases",
      typeItems: ["Purchases", 'Statestore'],
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
    countTotalQty() {
      return this.results.reduce((acc, curVal) => {
        return acc += curVal.totalQty
      }, 0.)
    },
    countTotalQtySold() {
      return this.results.reduce((acc, curVal) => {
        return acc += curVal.quantitySold
      }, 0.)
    },
    countRemaining() {
      return this.results.reduce((acc, curVal) => {
        return acc += curVal.totalQty - curVal.quantitySold
      }, 0.)
    },
    computedDateFormattedMomentjs() {
      return this.date ? moment(this.date).format('dddd, MMMM Do YYYY') : ''
    },
    computedDateFormattedMomentjsForDateTo() {
      return this.dateto ? moment(this.dateto).format('dddd, MMMM Do YYYY') : ''
    },

    computedDateFormattedDatefns() {
      return this.date ? format(parseISO(this.date), 'EEEE, MMMM do yyyy') : ''
    },
    NumberOfPage() {
      if (this.page_size == 'All') {
        return 1
      }
      let answer = Math.ceil(parseInt(this.count) / parseInt(this.page_size));
      if (answer < 1)
        answer = 1
      return answer
    },

    filteredItems() {
      let filtered = this.purchases
      const query = this.searchFilter.toLowerCase().trim()

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
    selectedProduct: {
      handler() {
        this.getPurchases();
      },
    },

    typeItem: {
      handler() {
        this.getPurchases();
      },
    }

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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getPurchases() {
      this.$store.commit("setIsLoadingData", true);

      let pagination = ``;
      let search = ``;
      if (this.page_size === "All") {
        this.page_size = this.count;
      } else {
        pagination = `?page=${this.page}&perpage=${this.page_size}`;

      }

      var dateVariables = ''
      if (this.date != null) {
        dateVariables = `&datefrom=${this.date}`
      }

      if (this.dateto != null) {
        dateVariables += `&dateto=${this.dateto}`
      }
      let selectedProduct = ''

      if (this.selectedProduct != '') {
        selectedProduct = `&selectedProduct=${this.selectedProduct}`
      }
      if (this.selectedProduct == null) {
        selectedProduct = `&selectedProduct=`
      }

      if (this.typeItem == 'Purchases') {
        await axios
          .get(`kcs/api/products-purchased/${pagination}${dateVariables}${selectedProduct}`)
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

      }
      else {
        await axios
          .get(`kcs/api/store-state-purchased/${pagination}${dateVariables}${selectedProduct}`)
          .then((response) => {
            setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
            // anticipate the django return
            this.count = response.data.count;
            setTimeout(() => (this.results = response.data.results), 800);
          })
          .catch((error) => {
            console.log(error);
            setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
          });
      }
    },
  },
};
</script>
