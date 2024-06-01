<template>
  <div class="dashboard">
    <v-row class="ma-0">
      <v-subheader class="d-flex justify-space-between align-center">
        <h2 elevation="5" class="mt-4">Dashboard</h2>
      </v-subheader>
      <v-spacer></v-spacer>
      <div class="mt-1 mr-2">
        <template>
          <v-row class="mt-4">
            <v-col cols="9">
              <v-menu v-model="menu1" :close-on-content-click="true">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field dense class='mt-0' :value="computedDateFormattedMomentjs"  readonly
                    v-bind="attrs" v-on="on" @click:clear="filterDate = null"></v-text-field>
                </template>
                <v-date-picker v-model="filterDate" @change="menu1 = false"></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="3" >
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(item, i) in itemsPeriod" :key="i">
                    <v-list-item-content>
                      <v-list-item-title :class="{ 'active': item.title === vlistFilterTime }"
                        @click="getDashboardAnalysis(item.title)" class="vlistFilterTime"
                        v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                </v-list>

              </v-menu>
            </v-col>
          </v-row>
        </template>
      </div>
    </v-row>

    <v-row class="ma-0">
      <v-col cols="11" lg="6" sm="12">
        <v-row no-gatthers>
          <v-col cols="6" lg="6">
            <v-card elevation="4" class="rounded-lg">
              <v-card-text class="d-flex justify-space-between align-center">
                <div class="inline">
                  <strong style="color:#ff6767"> {{ dataDashboard.totalOrderDebts }} $</strong>
                  <div class="mt-2">
                    <v-icon size="40">mdi mdi-cart-remove</v-icon>
                    <small> Debts recognized of {{ vlistFilterTime }}</small>
                  </div>
                </div>
                <v-avatar color="#ff6767" style="color:white" size="80">
                  <span>Debts</span>
                </v-avatar>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" lg="6">
            <v-card elevation="4" class="rounded-lg">
              <v-card-text class="d-flex justify-space-between align-center">
                <div class="inline">
                  <strong style="color:purple"> {{ dataDashboard.clients }} </strong>
                  <div class="mt-2">
                    <v-icon size="40">mdi mdi-face-agent</v-icon>
                    <small>All clients during this {{ vlistFilterTime }}</small>
                  </div>
                </div>
                <v-avatar color="purple" size="80">
                  <span>Clients</span>
                </v-avatar>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" lg="6">
            <v-card elevation="4" class="rounded-lg">
              <v-card-text class="d-flex justify-space-between align-center">
                <div class="inline">
                  <strong style="color:indigo">{{ dataDashboard.costOfCostOrders }} $</strong>
                  <div class="mt-2">
                    <v-icon size="40">mdi mdi-basket-unfill</v-icon>
                    <small> mount of orders</small>
                  </div>
                </div>
                <v-avatar color="indigo" size="80">
                  <span>Orders</span>
                </v-avatar>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" lg="6">
            <v-card elevation="4" class="rounded-lg">
              <v-card-text class="d-flex justify-space-between align-center">
                <div class="inline">
                  <strong style="color:green"> {{ dataDashboard.Payments }} $</strong>
                  <div class="mt-2">
                    <v-icon size="40">mdi mdi-chart-areaspline</v-icon>
                    <small>Payments accumulated during this {{ vlistFilterTime }}</small>
                  </div>
                </div>
                <v-avatar color="info" size="80">
                  <span>Payments</span>
                </v-avatar>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="6">
        <BarChartFinance :monthyAnalysisData="dataDashboard.monthyAnalysisData"
          aria-label="Sales figures for the years 2022 to 2024. Sales in 2022: 987, Sales in 2023: 1209, Sales in 2024: 825.">
        </BarChartFinance>
      </v-col>
    </v-row>

    <v-row class="ma-0">
      <v-col cols="12" lg="6">

        <v-card no-gatthers elevation="4" class="mt-2">
          <v-card-title class="text--disabled">
            The state of the store
          </v-card-title>

          <template>

            <v-simple-table class="mt-0 ml-2" fixed-header height="300px">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      *
                    </th>
                    <th class="text-left">
                      Product
                    </th>
                    <th class="text-left">
                      Categorie
                    </th>
                    <th class="text-left">
                      Total Quantity
                    </th>
                    <th class="text-left">
                      Remaining Quantity
                    </th>
                    <th class="text-left">
                      numberOfSells
                    </th>
                  </tr>
                </thead>
                <tbody>

                  <tr v-for="item in dataDashboard.storestateItems" :key="item.product.id">
                    <td>
                      <v-img v-if="item.product.get_image !== null" cover height="50" width="50"
                        :src="item.product.get_image" alt="">
                      </v-img>
                      <v-img v-else>
                        not found
                      </v-img>
                    </td>
                    <td>{{ item.product.category.name }} </td>
                    <td>{{ item.product.name }}</td>
                    <td>{{ item.totalQuantity }}</td>
                    <td>{{ item.remainingQuantity }}</td>
                    <td>{{ item.countTimesPurchased }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </template>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6" class="mt-2">

        <v-alert class="text--white" border="right" color="indigo">
          <span>Recent service's orders details</span>
        </v-alert>
        <v-alert border="left" color="blue-grey" dark v-for="item in dataDashboard.recentsServices">
          {{ item.total_price }}$ gained in<br>
          {{ item.description }}
        </v-alert>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import BarChartFinance from './BarChartFinance.vue'
import moment from 'moment'
import axios from 'axios'
import { format, parseISO } from 'date-fns'
export default {
  name: 'Dasboard',
  components: { BarChartFinance },
  data() {
    return {
      vlistFilterTime: 'Week',
      dataDashboard: '',
      errors: [],
      menu1: false,
      filterDate: format(parseISO(new Date().toISOString()), 'yyyy-MM-dd'),
      itemsPeriod: [
        { title: 'Month' },
        { title: 'Year' },
        { title: 'Day' },
        { title: 'Week' },
      ]
    }
  },
  //most used when the property changes for calling the api
  watch: {
    vlistFilterTime: {
      handler() {
        this.getDashboardAnalysis(this.vlistFilterTime);
      },
    },
    filterDate: {
      handler() {
        this.getDashboardAnalysis(this.vlistFilterTime)
      },
    },
  },
  mounted() {
    this.getDashboardAnalysis(this.vlistFilterTime)
  },
  computed: {
    computedDateFormattedMomentjs() {
      return this.filterDate ? moment(this.filterDate).format('dddd, MMMM Do YYYY') : ''
    },
  },
  methods: {
    async getDashboardAnalysis(title) {
      this.vlistFilterTime = title
      this.$store.commit("setIsLoadingData", true);
      await axios
        .get(`kcs/api/dashboard-results/?periodfilter=${this.vlistFilterTime}&filterDate=${this.filterDate}`)
        .then((response) => {
          this.dataDashboard = response.data
        })
        .catch((error) => {
          if (error.response) {
            for (const property in error.response.data) {
              this.errors.push(
                `${property} : ${error.response.data[property]}`
              );
            }
          } else if (error.message) {
            for (i in error) {
              console.log(i);
            }
            this.errors.push("Something went wrong, Please try again");
          }
        })
        .finally(() => {
          this.$store.commit("setIsLoadingData", false);
        });
    }

  }
}
</script>

<style scoped>
span {
  color: white;
  font-weight: 550;
}

.vlistFilterTime.active,
.vlistFilterTime:hover {
  color: rgb(4, 0, 255)
}
</style>
