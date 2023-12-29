<template>
  <v-container pa-4>
    <v-card class="mt-2" elevation="2">
      <v-row>
        <v-row>
          <v-col cols="8" class="pa-2 ml-2">
            <v-text-field
              class="mt-2 ml-3"
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              solo
              dense
              outlined
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2" class="mr-7" align="end">
            <addCategory v-on:getCategories="getCategories"></addCategory>
          </v-col>
        </v-row>
      </v-row>
      <v-expansion-panels focusable>
        <v-expansion-panel v-for="item in categories" :key="item.id">
          <v-expansion-panel-header>{{ item.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="10"> {{ item.description }}</v-col>
              <v-col cols="2" align="end">
                <v-row no-gutters class="mr-0">
                  <v-col cols="12">
                    <editCategory
                      :categoryObjectFromParent="item"
                      v-on:getCategories="getCategories"
                    ></editCategory>
                  </v-col>
                  <v-col cols="12">
                    <deleteCategory
                      :categoryObjectFromParent="item"
                      v-on:getCategories="getCategories"
                    ></deleteCategory>
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
              <v-pagination
                v-model="page"
                :length="NumberOfPage"
                circle
              ></v-pagination>
            </v-col>
            <v-col cols="2">
              <v-select
                :items="itemsPrint"
                v-model="page_size"
                label="Row per page"
              ></v-select>
            </v-col>
          </v-row>
        </div>
      </template>
    </v-card>
  </v-container>
</template>

<script>
import addCategory from "../categories/addCategorie.vue";
import editCategory from "../categories/editCategorie.vue";
import deleteCategory from "../categories/deleteCategorie.vue";
import axios from "axios";
export default {
  components: { addCategory, editCategory, deleteCategory },
  data() {
    return {
      categories: [],
      search: "",
      dialog: false,
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
  },

  //most used when the property changes for calling the api
  watch: {
    page: {
      handler() {
        this.getCategories();
      },
      //this property will mount the categories
      immediate: true,
    },

    page_size: {
      handler() {
        this.getCategories();
      },
    },

    search: function (newValue, olValue) {
      this.getCategories();
    },
  },

  methods: {
    async getCategories() {
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
        .get(`kcs/api/categories/${pagination}${search}`)
        .then((response) => { 

          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);

          // anticipate the django return
          if (response.data.results) {
            this.count = response.data.count;
            response.data = response.data.results;
          }
          setTimeout(() => (this.categories = response.data), 800);
        })
        .catch((error) => {
          console.log(error);
          setTimeout(() => this.$store.commit("setIsLoadingData", false), 800);
        });
    },
  },
};
</script>
