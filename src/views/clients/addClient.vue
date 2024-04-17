<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mt-1" 
        elevation="2"
        color="extraMeny"
        icon
        outlined
        v-bind="attrs"
        v-on="on"
      >
        <v-icon> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Client</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="form">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Name of the Client"
                  hint="example of the categorie  : Jean Bralima"
                  persistent-hint
                  :rules="[rules.required]"
                  required
                  v-model="name"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  type="phone"
                  v-model="phoneNumber"
                  label="phoneNumber"
                  hint="Tap the number of the Client here! ( put - if no one)"
                  persistent-hint
                  required
                  :rules="[rules.required]"
                  clearable
                  rows="4"
                  clear-icon="mdi-close-circle"
                  value="This is clearable text."
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Adresse of the Client"
                  hint="example: Kadutu Nkafu N°23"
                  persistent-hint
                  :rules="[rules.required]"
                  required
                  v-model="adresse"
                ></v-text-field>
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
        <v-btn
          :loading="loadingButton"
          color="blue darken-1"
          text
          @click="postForAddingClient()"
          :disabled="!form"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
export default {
  name: "addClient",
  data() {
    return {
      dialog: false,
      form: false,
      errors: [],
      name: "",
      adresse:"",
      phoneNumber: "",
      loadingButton: false,
      rules: {
        required: (v) => !!v || " This field is required",
      },
    };
  },
  methods: {
    removeAddDialog() {
      this.name = "";
      this.phoneNumber = "";
      this.dialog = false;
      this.adresse = ""
      this.errors = [];
    },

    async postForAddingClient() {
      this.loadingButton = true;
      this.errors = [];
      await axios
        .post("kcs/api/customers/", {
          name: this.name,
          phoneNumber: this.phoneNumber,
          adresse: this.adresse,
        })
        .then((response) => { 
          this.$emit("getCustomers");
          this.dialog = false;
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
