<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mt-1 ml-1" elevation="2" color="primary" icon v-bind="attrs" v-on="on">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Edit product#({{ id }})</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row>
              <v-col cols="6">
                <v-text-field clearable outlined label="Name of the supplier" hint="E.g:Jewlry" persistent-hint
                  :rules="[rules.required]" required v-model="name"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field outlined v-model="unit_measurement" label="Unit Measurement" hint="E.g: Kg" persistent-hint
                  required :rules="[rules.required]" clearable rows="4" clear-icon="mdi-close-circle"
                  value="This is clearable text."></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-textarea label="Description" outlined clearable hint="Describe the product here" persistent-hint
                  :rules="[rules.required]" required v-model="description"></v-textarea>
              </v-col>
              <v-col cols="6">
                <v-select rows="3" outlined :items="categories" item-value="id" item-text="name"
                  hint="Select one category you created" v-model="selectedCategory" label="category"></v-select>
                <v-file-input v-model="image" outlined :rules="avatarRules" accept="image/png, image/jpeg, image/bmp"
                  placeholder="Pick an avatar" prepend-icon="mdi-camera" label="Avatar"></v-file-input>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <small>indicates required field</small>
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
        <v-btn :loading="loadingButton" color="blue darken-1" text @click="putProduct()" :disabled="!form">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
  name: "editProduct",
  props: {
    productObjectFromParent: Object,
  },
  data() {
    return {
      dialog: false,
      form: false,
      errors: [],
      id: this.productObjectFromParent.id,
      image: this.productObjectFromParent.image,
      name: this.productObjectFromParent.name,
      selectedCategory: this.productObjectFromParent.category.id,
      unit_measurement: this.productObjectFromParent.unit_measurement,
      description: this.productObjectFromParent.description,
      categories: "",
      image: null,
      avatarRules: [
        // (value) => !!value || 'Avatar is required',
        (value) => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB',
      ],
      loadingButton: false,
      rules: {
        required: (v) => !!v || " This field is required",
      },
    };
  }, mounted() {
    this.getCategories()
  },
  methods: {
    slugValue() {
      // Replace spaces and special characters with dashes to create a slug
      let slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      return slug;
    },
    removeAddDialog() {
      // this.name = "";
      // this.image = "";
      // this.unit_measurement = "";
      // this.description = "";
      // this.categories = "";
      this.errors = [];
      this.dialog = false;
    },
    async getCategories() {
      await axios
        .get(`kcs/api/categories/`)
        .then((response) => {
          this.categories = response.data
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async putProduct() {
      this.loadingButton = true;
      this.errors = [];
      const formData = new FormData()
      formData.append('name', this.name)
      if (this.image != null)
        formData.append('image', this.image)
      formData.append('slug', this.slugValue())
      formData.append('unit_measurement', this.unit_measurement)
      formData.append('category_id', this.selectedCategory)
      formData.append('description', this.description)

      await axios
        .put(`kcs/api/products/${this.id}/`, formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        .then((response) => {
          this.$emit("getProducts");
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
    },
  },
};
</script>
