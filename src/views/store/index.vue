<template>
  <v-card class="pa-3" elevation="2">
    <v-row no-gutters>
      <v-col cols="12" sm="3" class="pa-1" no-gutters>
        <v-select dense class="pa-0" :items="$store.state.Allproducts" item-value="id" item-text="name"
          hint="Select product" v-model="selectedProduct" label="Product" outlined clearable></v-select>
      </v-col>
      <v-col cols="12" sm="3" class="pa-1" no-gutters>
        <v-select dense class="pa-0" :items="valueStore" hint="specify which method to use" v-model="methodValueStore"
          label="Value Store" outlined></v-select>
      </v-col>
      <v-col cols="12" sm="3" class="pa-3" no-gutters>
        <v-menu v-model="menu1" :close-on-content-click="false" transition="scale-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field dense :value="computedDateFormattedMomentjs" clearable label="From" readonly v-bind="attrs"
              v-on="on" @click:clear="date = null"></v-text-field>
          </template>
          <v-date-picker dense v-model="date" @change="menu1 = false" scrollable></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="3" class="pa-3" no-gutters>
        <v-menu v-model="menu2" :close-on-content-click="false" transition="scale-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field dense :value="computedDateFormattedMomentjsForDateTo" clearable label="To" readonly
              v-bind="attrs" v-on="on" @click:clear="dateto = null"></v-text-field>
          </template>
          <v-date-picker dense v-model="dateto" @change="menu2 = false" scrollable></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" v-if="productsPurchasedShow">
        <v-simple-table class="responsive-table" style="border: indigo 1px solid;" fixed-header height="500px">
          <template v-slot:default>
            <caption>Storing</caption>
            <thead>
              <tr>
                <th>#id</th>
                <th class="text-left">
                  Date
                </th>
                <th class="text-left">
                  Products
                </th>
                <th>qty
                </th>
                <th class="text-left">
                  pu
                </th>
                <th class="text-left">
                  pt($)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ItemsEnterLeaveStore.productsPurchased" :key="item.index">
                <td>{{ item.id }}</td>
                <td>{{ item.readable_created_at }}</td>
                <td>{{ item.product.name }}</td>
                <td>{{ item.stock_quantity }}</td>
                <td>{{ item.unit_price }}</td>
                <td>{{ item.stock_quantity * item.unit_price }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="12" class="mt-2">
        <v-simple-table class="responsive-table" style="border: indigo 1px solid; " fixed-header height="500px">
          <template v-slot:default>
            <caption>Selling</caption>
            <thead>
              <tr>
                <th class="text-left">Date</th>
                <th class="text-left">Product</th>
                <th class="text-center">puv</th>
                <th class="text-center">TotalQty</th>
                <th style="border: none;" class="text-center" colspan="5">DetailsStore</th>
                <th style="border: none;" class="text-center">pta</th>
                <th style="border: none;" class="text-center">ptv</th>
                <th style="border: none;" class="text-center">resultat</th>
              </tr>
              <tr>
                <th class="text-left"></th>
                <th class="text-left"></th>
                <th class="text-left"></th>
                <th class="text-left"></th>
                <th class="text-center">qty</th>
                <th class="text-center">pua</th>
                <th class="text-center">pta</th>
                <th class="text-center">ptv</th>
                <th class="text-center">res</th>
                <th class="text-left"></th>
                <th class="text-left"></th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ItemsEnterLeaveStore.orderItemLeavingCost" :key="item.index">
                <td>{{ item.orderitem.returnOrderDate }}</td>
                <td class="text-right">{{ item.orderitem.product.name }}</td>
                <td class="text-right">{{ item.orderitem.unit_price }}</td>
                <td class="text-right">{{ item.orderitem.quantity }}</td>
                <td class="text-right">
                  <div v-for="detail in item.leavingCostItems" :key="detail.index" text-color="white">
                    {{ fixedValue(detail.qty) }}
                  </div>
                </td>
                <td class="text-right">
                  <div v-for="detail in item.leavingCostItems" :key="detail.index" text-color="white">
                    {{ detail.unit_price }}
                  </div>
                </td>
                <td class="text-right">
                  <div v-for="detail in item.leavingCostItems" :key="detail.index" text-color="white">
                    {{ fixedValue(detail.unit_price * detail.qty) }}
                  </div>
                </td>
                <td class="text-right">
                  <div v-for="detail in item.leavingCostItems" :key="detail.index" text-color="white">
                    {{ fixedValue(item.orderitem.unit_price * detail.qty) }}
                  </div>
                </td>
                <td class="text-right">
                  <div v-for="detail in item.leavingCostItems" :key="detail.index" text-color="white">
                    {{ fixedValue(-(detail.unit_price * detail.qty) + (item.orderitem.unit_price * detail.qty)) }}
                  </div>
                </td>
                <td>
                  {{ totalLeavingPrice(item.leavingCostItems) }}
                </td>
                <td class="text-right">
                  {{ fixedValue(item.orderitem.unit_price * item.orderitem.quantity) }}
                </td>
                <td class="text-right">
                  {{ fixedValue(fixedValue(item.orderitem.unit_price * item.orderitem.quantity) -
          totalLeavingPrice(item.leavingCostItems)) }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <div class="mt-2">
        <div class="row mt-2 ml-1">
          <div>TotalQty : {{ allTotalSellingQty }} ($)</div>
          <div class="ml-3"> AllPta : {{ allTotalPurchasedCost }} ($)</div>
        </div>
        <div class="row ml-1">
          <div>AllPtv : {{ allTotalSelling }} ($)</div>
          <div class="ml-3">resultat {{ fixedValue(allTotalSelling - allTotalPurchasedCost) }} : ($)</div>
        </div>
      </div>
    </v-row>

  </v-card>
</template>

<style scoped>
.v-simple-table {
  margin-top: 0 !important;
}

.v-card {
  padding: 16px !important;
}


.responsive-table {
  border: indigo 1px solid;
  margin-top: 0;
  margin-left: 0.5rem;
}

/* Adjust the margin for medium and larger screens */
@media (max-width: 960px) {
  .responsive-table {
    margin-top: 0.5rem;
    margin-left: 0;
  }
}
</style>
<script>
import axios from "axios";
import moment from 'moment'
import { format, parseISO } from 'date-fns'
export default {
  components: {},
  data() {
    return {
      date: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      dateto: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      menu1: false,
      menu2: false,
      methodValueStore: 'LIFO',
      productsPurchasedShow: false,
      clients: [],
      selectedProduct: "",
      searchFilter: "",
      dialog: false,
      page: 1,
      count: 1,
      page_size: "5",
      valueStore: ['LIFO', "FIFO"],
      itemsOnPage: ['2', "5", '10', "15", "All"],
      ItemsEnterLeaveStore: []
    };
  },
  computed: {
    allTotalSellingQty() {
      let totalQty = 0.0;
      if (this.ItemsEnterLeaveStore.orderItemLeavingCost && Array.isArray(this.ItemsEnterLeaveStore.orderItemLeavingCost)) {
        this.ItemsEnterLeaveStore.orderItemLeavingCost.forEach(item => {
          if (item.leavingCostItems && Array.isArray(item.leavingCostItems)) {
            item.leavingCostItems.forEach(detail => {
              totalQty += detail.qty;
            });
          }
        });
      }
      return totalQty.toFixed(3);
    },

    allTotalSelling() {
      let totalSelling = 0.0;
      if (this.ItemsEnterLeaveStore.orderItemLeavingCost && Array.isArray(this.ItemsEnterLeaveStore.orderItemLeavingCost)) {
        this.ItemsEnterLeaveStore.orderItemLeavingCost.forEach(item => {
          totalSelling += item.orderitem.unit_price * item.orderitem.quantity;
        });
      }
      return totalSelling.toFixed(3);
    },

    allTotalPurchasedCost() {
      let totalPurchasedCost = 0.0;
      if (this.ItemsEnterLeaveStore.orderItemLeavingCost && Array.isArray(this.ItemsEnterLeaveStore.orderItemLeavingCost)) {
        this.ItemsEnterLeaveStore.orderItemLeavingCost.forEach(item => {
          if (item.leavingCostItems && Array.isArray(item.leavingCostItems)) {
            item.leavingCostItems.forEach(detail => {
              totalPurchasedCost += detail.qty * detail.unit_price;
            });
          }
        });
      }
      return totalPurchasedCost.toFixed(3);
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

  },

  //most used when the property changes for calling the api
  watch: {

    page: {
      handler() {
        this.getItemsEnterLeaveStore();
      },
    },

    selectedProduct: {
      handler() {
        this.getItemsEnterLeaveStore();
      },
    },
    page_size: {
      handler() {
        this.getItemsEnterLeaveStore();
      },
    },

    date: {
      handler() {
        this.getItemsEnterLeaveStore()
      }
    },
    dateto: {
      handler() {
        this.getItemsEnterLeaveStore()
      }
    },
    methodValueStore: {
      handler() {
        this.getItemsEnterLeaveStore()
      }
    },
  },
  async mounted() {
    this.getItemsEnterLeaveStore()
  },
  methods: {
    totalLeavingPrice(items) {
      var answer = 0
      items.forEach(element => {
        answer += element.qty * element.unit_price
      });
      return answer.toFixed(3)
    },

    fixedValue(value) {
      return value.toFixed(3)
    },
    async getItemsEnterLeaveStore() {
      this.$store.commit("setIsLoadingData", true)
      let pagination = ``;
      let search = ``;
      let methodValueStore = ''
      let selectedProduct = ''
      if (this.page_size === "All") {
        this.page_size = this.count;
      } else {
        pagination = `?page=${this.page}&perpage=${this.page_size}`;
      }

      var dateVariables = ''
      if (this.search != "") {
        search = `&search=${search}`;
      }
      if (this.date != null) {
        dateVariables = `&datefrom=${this.date}`
      }

      if (this.dateto != null) {
        dateVariables += `&dateto=${this.dateto}`
      }
      if (this.selectedProduct != '') {
        selectedProduct = `&selectedProduct=${this.selectedProduct}`
      }

      if (this.selectedProduct == null) {
        selectedProduct = `&selectedProduct=`
      } 
      
      if (this.methodValueStore != '') {
        methodValueStore = `&methodValueStore=${this.methodValueStore}`
      }

      await axios
        .get(`kcs/api/store-state/${pagination}${dateVariables}${methodValueStore}/${selectedProduct}`)
        .then((response) => {
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
          this.count = response.data.count
          console.log(this.ItemsEnterLeaveStore)
          setTimeout(() => (this.ItemsEnterLeaveStore = response.data
          ), 800);
        })
        .catch((error) => {
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
        })

    },
  },
}
</script>