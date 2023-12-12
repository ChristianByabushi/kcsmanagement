<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mt-1"
        elevation="2"
        color="primary"
        icon
        outlined
        v-bind="attrs"
        v-on="on"
      >
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5"
          >Edit Category ( {{ categoryObjectFromParent.id }})</span
        >
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Name of the category*"
                  hint="example of the categorie  : Location"
                  persistent-hint
                  required
                  :rules="[rules.required]"
                  v-model="name"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  label="Description*"
                  hint="Here you may describe what is done in this category"
                  persistent-hint
                  required
                  :rules="[rules.required]"
                  clearable
                  rows="4"
                  clear-icon="mdi-close-circle"
                  value="This is clearable text."
                ></v-textarea>
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
        <v-btn
          :loading="loadingButton"
          color="blue darken-1"
          text
          @click="putCategory()"
          :disabled="!form"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
  name: "editCategory",
  props: {
    categoryObjectFromParent: Object,
  },
  data() {
    return {
      dialog: false,
      form: false,
      errors: [],
      name: this.categoryObjectFromParent.name,
      description: this.categoryObjectFromParent.description,
      loadingButton: false,
      id: this.categoryObjectFromParent.id,
      rules: {
        required: (v) => !!v || " This field is required",
      },
    };
  },
  methods: {
    removeAddDialog() {
      this.name = "";
      this.description = "";
      this.dialog = false;
      this.errors = [];
    },

    slugValue() {
      // Replace spaces and special characters with dashes to create a slug
      let slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      return slug;
    },

    async putCategory() {
      this.loadingButton = true;
      this.errors = [];
      await axios
        .put(`kcs/api/categories/${this.id}/`, {
          name: this.name,
          description: this.description,
          slug: this.slugValue(),
        })
        .then((response) => {
          this.$emit("getCategories");
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
