<template>
    <tr>
        <!-- Number -->
        <td style="padding-left: 20px;">
            {{ index + 1 }}
        </td>
        <!-- Name -->
        <td>
            <v-select :items="products" item-text="name" item-value="id" v-model="product_id"></v-select>
        </td>
        <!-- Pu -->
        <td>
            <v-text-field v-model="pu">
            </v-text-field>
        </td>
        <!-- Qty -->
        <td>
            <v-text-field v-model="qty"></v-text-field>
        </td>

        <!-- Total amount -->
        <td class="mt-4">${{ totalAmount.toFixed(2) }}</td>

        <td class="mt-4">
            <v-btn class="puple" x-small @click="removeFromOrderItem()">
                <v-icon small>mdi-delete</v-icon>
            </v-btn>
        </td>
    </tr>
</template>
<script>
import axios from "axios";
name: 'orderItem';
export default {
    props: {
        orderItem: Object,
        index: Number
    },
    data() {
        return {
            products: [],
            pu: this.orderItem.pu,
            qty: this.orderItem.qty,
            totalAmount: 0,
            myOrderIndex: 0,
            product_id: this.orderItem.product_id,
        };
    },
    mounted() {
        this.getProducts()
        this.calculateTotal()
    },
    watch: {
        pu(newVal, oldVal) {
            this.calculateTotal()
            this.updateParent()
        },
        qty(newVal, oldVal) {
            this.calculateTotal()
            this.updateParent()
        },

        product_id(newVal, oldVal) {
            this.updateParent()
        },

    },
    methods: {

        calculateTotal() {
            const unit_price = parseFloat(this.pu)
            const quantity = parseFloat(this.qty)

            if (!isNaN(unit_price) && !isNaN(quantity)) {
                this.totalAmount = unit_price * quantity
            } else {
                this.totalAmount = 0;
            }
        },
        removeFromOrderItem() {
            this.$emit('removeFromOrderItem', this.myOrderIndex)
        },

        updateParent() {
            // Emit the updated values to the parent component
            this.$emit("updateItem", {
                index: this.index,
                pu: this.pu,
                product_id: this.product_id,
                qty: this.qty
            });
        },

        async getProducts() {
            await axios
                .get(`kcs/api/products/`)
                .then((response) => {
                    this.products = response.data
                    console.log(this.products)
                })
                .catch((error) => {
                    console.log(error);
                });
        },
    },
};
</script>
