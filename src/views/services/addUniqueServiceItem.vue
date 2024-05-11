<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn small class="ma-1" elevation="2" color="primary" icon outlined v-bind="attrs" v-on="on">
        <v-icon small> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h6">ADD SERVICE ON THE ORDER </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row cols="12">
              <v-col cols="6">
                <v-select :items="$store.state.Allcategories" item-value="id" item-text="name" v-model="category_id"
                  label="Category"></v-select>
              </v-col>
              <v-col cols="6">
                <v-text-field type="number" label="Cost of the service" v-model="total_price">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea type="text" label="Description" v-model="description">
                </v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <small>*indicates required field</small>
        <div class="error mt-2" v-if="errors.length">
          <v-alert dense type="error" v-for="error in errors" :key="error">{{
    error
  }}</v-alert>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="removeAddDialog()">
          Close
        </v-btn>
        <v-btn :loading="loadingButton" color="blue darken-1" text @click="editOrderItem()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
  name: "addUniqueServiceItem",
  props: {
    OrderObject: Object,
  },

  data() {
    return {
      dialog: false,
      form: false,
      errors: [],
      description: '',
      category_id: null,
      total_price: 0,
      loadingButton: false,
      rules: {
        required: (v) => !!v || " This field is required",
      },
    };
  },

  created() {
    this.$store.dispatch('getCategories');
  },

  computed: {

  },

  methods: {
    removeAddDialog() {
      this.dialog = false;
      this.loadingButton = false;
      this.errors = [];
    },

    checkIfNotNull() {
      let result = true
      if ((this.total_price === 0) || isNaN(this.total_price) == True) {
        this.erros.push('Error: the total price musnt be equals to 0 or Nan')
        return false
      }
      return result
    },

    async editOrderItem() {
      this.loadingButton = true;
      this.errors = [];
      var result = true
      this.total_price = parseFloat(this.total_price).toFixed(3)
      if ((this.total_price === 0) || isNaN(this.total_price) == true) {
        this.errors.push('Error: the total price musnt be equals to 0 or Nan')
        result = false
      }

      if (result == false) {
        this.loadingButton = false;
        return false
      }

      else {
        await axios
          .post(`kcs/api/order-item-service/`, {
            'category_id': this.category_id,
            'customerOrder_id': this.OrderObject.id,
            'description': this.description,
            'total_price': this.total_price
          })
          .then((response) => {
            this.$emit("getOrders");
            this.dialog = false;
          })

          .catch((error) => {
            if (error.response) {
              for (const property in error.response.data) {
                this.errors.push(
                  `${property} : ${error.response.data[property]}`
                );
              }
              console.log(JSON.stringify(error.response.data));
            } else if (error.message) {
              for (i in error) {
                console.log(i);
              }
              this.errors.push("Something went wrong, Please try again");
              console.log(JSON.stringify(error.message));
            }
          })
          .finally(() => {
            this.loadingButton = false;
          });
      }
    },
  },
};
</script>
