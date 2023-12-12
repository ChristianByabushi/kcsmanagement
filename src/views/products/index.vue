<template>
  <v-container pa-4>
    <v-card class="mt-2" elevation="2">
      <v-row no-gatthers>
        <v-col cols="4" class="pa-2 ml-2">
          <v-text-field class="mt-2 ml-3" v-model="searchFilter" append-icon="mdi-magnify" label="Search" dense
            outlined></v-text-field>
        </v-col>
        <v-col cols="4" class="pa-0 ma-0">
          <v-select class="mt-4 ml-3" outlined dense :items="categories" item-value="id" item-text="name"
            v-model="selectedCategory" label="category"></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2" class="mr-7" align="end">
          <addProduct v-on:getProducts="getProducts"></addProduct>
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
                Description
              </th>
              <th class="text-left">
                UnitMeasurement
              </th>
              <th class="text-left">
                Category
              </th>
              <th class="text-left">
                Date
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
                <v-img v-if="item.image !== null" cover height="50" width="50" :src="item.image" alt="">
                </v-img>
                <v-img v-else>
                  not found
                </v-img>
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.unit_measurement }}</td>
              <td>{{ item.category.name }}</td>
              <td>{{ dataConvert(item.create_at) }}</td>
              <td>
                <editProduct :productObjectFromParent="item" v-on:getProducts="getProducts"></editProduct>
                <deleteProduct :productObjectFromParent="item" v-on:getProducts="getProducts"></deleteProduct>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <!-- <v-col cols="2" align="end">
          <v-row no-gutters class="mr-0">
            <v-col cols="12">
              <editProduct :productObjectFromParent="itemproduct" v-on:getProducts="getProducts">
              </editProduct>
            </v-col>
            <v-col cols="12">
              <deleteProduct :productObjectFromParent="itemproduct" v-on:getProducts="getProducts">
              </deleteProduct>
            </v-col>
          </v-row>
        </v-col> -->
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
import addProduct from "../products/addProduct.vue";
import editProduct from "../products/editProduct.vue";
import deleteProduct from "../products/deleteProduct.vue";
import axios from "axios";
export default {
  components: { addProduct, editProduct, deleteProduct },
  data() {
    return {
      products: [],
      search: "",
      categories: [],
      searchFilter: "",
      dialog: false,
      selectedCategory: null,
      page: 1,
      count: 0,
      page_size: 2,
      itemsPrint: [2, 5, 10, 15, "All"],
    };
  },

  computed: {
    NumberOfPage() {
      return Math.ceil(this.count / this.page_size);
    },
    filteredItems() {
      let filtered = this.products
      const query = this.searchFilter.toLowerCase().trim()

      // Filter by selected category if present
      if (this.selectedCategory !== null) {
        filtered = filtered.filter(item =>
          item.category.id === this.selectedCategory
        );
      }

      if (query) {
        return this.products.filter((item) =>
          item.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
      }

      return filtered;
    }

  },



  //most used when the property changes for calling the api
  watch: {
    page: {
      handler() {
        this.getProducts();
      },
      //this property will mount the categories
      immediate: true,
    },

    page_size: {
      handler() {
        this.getProducts();
      },
    },


    search: function (newValue, olValue) {
      this.getProducts();
    },

  },

  async mounted() {
    this.getCategories()
  },
  methods: {
    dataConvert(value) {
      return new Date(value)
    },
    async getCategories() {
      await axios
        .get(`kcs/api/categories/`)
        .then((response) => {
          this.categories = response.data
          this.categories.push({
            'id': null,
            'name': "All choices"
          })
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getProducts() {
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
        .get(`kcs/api/products/${pagination}${search}`)
        .then((response) => {
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
          // anticipate the django return
          if (response.data.results) {
            this.count = response.data.count;
            response.data = response.data.results;
          }
          setTimeout(() => (this.products = response.data), 800);
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
        });
    },
  },
};
</script>
