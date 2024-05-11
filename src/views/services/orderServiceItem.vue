<template>
    <tr class="pt-2">
        <!-- Number -->
        <td style="padding-left: 20px;">
            {{ index + 1 }}
        </td>
        <!-- Name -->
        <td>
            <v-select :items="listOfCategoriesToTreat" @click="beforeSelectiongCategory()"
                @keydown="afterSelectingCategory()" item-text="name" item-value="id" v-model="category_id"></v-select>
        </td>
        <!-- Pu -->
        <td>
            <v-textarea class="mt-1"outlined v-model="description" rows="1" required>
            </v-textarea>
        </td>
        <!-- Qty -->
        <td>
            <v-text-field type="number" v-model="total_price"></v-text-field>
        </td>

        <td class="mt-4">
            <v-btn class="puple" x-small @click="removeServiceOrderItem()">
                <v-icon small>mdi-delete</v-icon>
            </v-btn>
        </td>
    </tr>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
name: 'orderItem';
export default {
    props: {
        orderServiceItem: Object,
        index: Number,
    },
    data() {
        return {
            total_price: this.orderServiceItem.total_price,
            description: this.orderServiceItem.description,
            totalAmount: 0,
            myOrderIndex: 0,
            category_id: this.orderServiceItem.category_id,
            listOfCategoriesToTreat: this.$store.state.Allcategories
        };
    },
    computed: {
        ...mapGetters(
            ['categories', 'listOfCategoriesRemaining']
        )
    },
    created() {
        this.$store.dispatch('getCategories');
    },
    mounted() {

    },
    watch: {
        description(newVal, oldVal) {
            this.updateServiceParent()
        },
        total_price(newVal, oldVal) { 
            this.updateServiceParent()
        },

        category_id(newVal, oldVal) { 
            this.updateServiceParent() 
            this.afterSelectingCategory()
        },

    },
    methods: {
        removeServiceOrderItem() {
            this.$emit('removeServiceOrderItem', this.myOrderIndex)
        },

        beforeSelectiongCategory() {
            //at selection 
            this.listOfCategoriesToTreat = this.listOfCategoriesRemaining
        },
        afterSelectingCategory() {
            //after
            this.listOfCategoriesToTreat = this.$store.state.Allcategories
            // Intelligently the value of product_id will already been updated 
            // here I know that the item has already changed
        },

        updateServiceParent() {
            // Emit the updated values to the parent component 
            this.$store.commit('updateServiceItem', {
                index: this.index,
                category_id: this.category_id,
                description: this.description,
                total_price: parseFloat(this.total_price),
            })
        },
    },
};
</script>
