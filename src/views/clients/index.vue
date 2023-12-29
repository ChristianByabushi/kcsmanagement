<template>
  <v-container pa-4>
    <v-card class="mt-2" elevation="2">
      <v-row>
        <v-row>
          <v-col cols="8" class="pa-2 ml-2">
            <v-text-field class="mt-2 ml-3" v-model="search" append-icon="mdi-magnify" label="Search" solo dense
              outlined></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2" class="mr-7" align="end">
            <addClient v-on:getCustomers="getCustomers"></addClient>
          </v-col>
        </v-row>
      </v-row>
      <v-expansion-panels focusable>
        <v-expansion-panel v-for="itemclient in clients" :key="itemclient.id">
          <v-expansion-panel-header> Client#{{ itemclient.id }} {{ itemclient.name }}, Adresse:{{ itemclient.adresse }},
            Phone number: {{
              itemclient.phoneNumber }} </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="10">
                <h3 color="grey darken-1" class="m-2 "> Orders of the client {{ itemclient.name }}</h3>

                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          #idOrder
                        </th>
                        <th class="text-left">
                          Date
                        </th>
                        <th class="text-left">
                          Deadline
                        </th>
                        <th class="text-left">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in itemclient.orders" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.order_date }}</td>
                        <td>{{ item.deadline }}</td>
                        <td>{{ item.total_amount }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>

              <v-col cols="2" align="end">
                <v-row no-gutters class="mr-0">
                  <v-col cols="12">
                    <editClient :ClientObjectFromParent="itemclient" v-on:getCustomers="getCustomers">
                    </editClient>
                  </v-col>
                  <v-col cols="12">
                    <deleteClient :ClientObjectFromParent="itemclient" v-on:getCustomers="getCustomers">
                    </deleteClient>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <template>
        <div class="text-center mt-2">
          <v-row>
            <v-col cols="10">
              <v-pagination v-model="page" :length="NumberOfPage" circle></v-pagination>
            </v-col>
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
import addClient from "../clients/addClient.vue";
import editClient from "../clients/editClient.vue";
import deleteClient from "../clients/deleteClient.vue";
import axios from "axios";
export default {
  components: { addClient, editClient, deleteClient },
  data() {
    return {
      clients: [],
      search: "",
      dialog: false,
      products: [],
      page: 1,
      count: 0,
      page_size: 5,
      itemsPrint: [2, 5, 10, 15, "All"],
    };
  },

  computed: {
    NumberOfPage() {
      return Math.ceil(this.count / this.page_size);
    },
  },

  //most used when the property changes for calling the api
  watch: {
    page: {
      handler() {
        this.getCustomers();
      },
      //this property will mount the categories
      immediate: true,
    },

    page_size: {
      handler() {
        this.getCustomers();
      },
    },

    search: function (newValue, olValue) {
      this.getCustomers();
    },
  },

  methods: {
    async getCustomers() {
      if (this.search === "") {
        this.$store.commit("setIsLoadingData", true);
      }

      let pagination = ``;
      let search = ``;
      if (this.page_size === "All") {
        this.page_size = this.count;
      } else {
        pagination = `?page=${this.page}&page_size=${this.page_size}`;
      }

      if (this.search != "") {
        search = `&search=${this.search}`;
      }

      await axios
        .get(`kcs/api/customers/${pagination}${search}`)
        .then((response) => {

          setTimeout(() => this.$store.commit("setIsLoadingData", false), 1000);

          // anticipate the django return
          if (response.data.results) {
            this.count = response.data.count;
          }
          setTimeout(() => (this.clients = response.data.results), 1000);
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 1000);
        });
    },
  },
};
</script>
