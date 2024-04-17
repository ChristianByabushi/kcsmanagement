<template>
    <v-dialog v-model="dialog" persistent max-width="400px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn small class="ma-1" elevation="2" color="error" icon outlined v-bind="attrs" v-on="on">
                <v-icon small> mdi-delete </v-icon>
            </v-btn>
        </template>
        <v-card>
            <v-card-title class="text-h5">
                Do you want to delete the <span> Invoice #({{ OrderObject.id }}) of client: {{ OrderObject.customer.name
                    }} of
                    {{
        OrderObject.formatted_order_date }} ? </span>
            </v-card-title>
            <v-card-text color="error">Please, if you delete this Order, it will no longer exist
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false"> Disagree </v-btn>
                <v-btn color="error" :loading="loadingButton" text @click="deleteOrder(OrderObject.id)">
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
        OrderObject: Object,
    },
    data() {
        return {
            loadingButton: false,
            dialog: false,
        };
    },
    methods: {
        async deleteOrder(idOrder) {
            this.loadingButton = true;
            this.errors = [];
            await axios
                .delete(`kcs/api/ordering/?idOrder=${idOrder}`)
                .then((response) => {
                    this.$emit("getOrders");
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