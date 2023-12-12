<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mt-2 ml-1"
        elevation="2"
        color="error"
        icon
        outlined
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small> mdi-delete </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="text-h5">
        Do you want to delete the stock-item :
        <span> {{ PurchaseObjectFromParent.product.name }} </span>
      </v-card-title>
      <v-card-text color="error"
        >Please, Remember that every product conatined by this category will get
        null value
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> Disagree </v-btn>
        <v-btn
          color="error"
          :loading="loadingButton"
          text
          @click="deletCategory(PurchaseObjectFromParent.id)"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  props: {
    PurchaseObjectFromParent: Object,
  },
  data() {
    return {
      loadingButton: false,
      dialog: false,
    };
  },
  methods: {
    async deletCategory(Categoryid) {
      this.loadingButton = true;
      this.errors = [];
      await axios
        .delete(`kcs/api/products-purchased/${Categoryid}`)
        .then((response) => {
          this.$emit("getPurchases");
          this.dialog = false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loadingButton = false;
        });
    },
  },
};
</script>
