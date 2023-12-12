<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="ma-1" elevation="2" color="error" icon v-bind="attrs" v-on="on">
        <v-icon> mdi-delete </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        Do you want to delete the product : <br>
        <span> {{ productObjectFromParent.name }} ? </span>
      </v-card-title>
      <v-card-text color="error">Please, Remember that every product conatined by this product will get
        null value
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> Disagree </v-btn>
        <v-btn color="error" :loading="loadingButton" text @click="deleteProduct(productObjectFromParent.id)">
          Agree
        </v-btn>
      </v-card-actions>
      <v-card-content>
        <div class="error pa-4" v-if="errors.length">
          <v-alert dense type="error" v-for="error in errors" :key="error">
            <v-row>
              {{
                error
              }}
            </v-row>

          </v-alert>

        </div>
      </v-card-content>
    </v-card>

  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: {
    productObjectFromParent: Object,
  },
  data() {
    return {
      loadingButton: false,
      dialog: false,
      errors: []
    };
  },
  methods: {
    async deleteProduct(id) {
      this.loadingButton = true;
      this.errors = [];
      await axios
        .delete(`kcs/api/products/${id}`)
        .then((response) => {
          this.$emit("getProducts");
          this.dialog = false;
        })
        .catch((error) => {
          this.errors.push("Verify if this product has bot been purchased somewhere. It might be the reason. So delete all entries it appears in for performing this task")
          console.log(error);
        })
        .finally(() => {
          this.loadingButton = false;
        });
    },
  },
};
</script>
