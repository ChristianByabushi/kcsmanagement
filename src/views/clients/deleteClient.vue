<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="mt-3"
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
        Do you want to delete the Client :
        <span> {{ ClientObjectFromParent.name }} </span>
      </v-card-title>
      <v-card-text color="error"
        >Please, Remember that every product conatined by this Client will get
        null value
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false"> Disagree </v-btn>
        <v-btn
          color="error"
          :loading="loadingButton"
          text
          @click="deleteClient(ClientObjectFromParent.id)"
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
    ClientObjectFromParent: Object,
  },
  data() {
    return {
      loadingButton: false,
      dialog: false,
    };
  },
  methods: {
    async deleteClient(Clientid) {
      this.loadingButton = true;
      this.errors = [];
      await axios
        .delete(`kcs/api/customers/${Clientid}`)
        .then((response) => {
          this.$emit("getCustomers");
          this.dialog = false;
        })
        .catch((error) => {
          alert(error);
        })
        .finally(() => {
          this.loadingButton = false;
        });
    },
  },
};
</script>
