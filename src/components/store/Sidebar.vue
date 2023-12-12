<template>
  <div>
    <v-sheet v-if="$vuetify.breakpoint.smAndUp"> Sidebar </v-sheet>
    <v-expansion-panels v-else>
      <v-expansion-panel>
        <v-expansion-panel-header expand-icon="fa-angle-down">
          Filters
        </v-expansion-panel-header>
        <v-expansin-panel-content>
          <v-radio-group v-model="priceFilter" :mandatory="True">
            <v-radio
              v-for="(price, i) in prices"
              :key="i"
              :label="price"
              :value="i"
            >
            </v-radio>
          </v-radio-group>
        </v-expansin-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prices: ["Any", "Under $25", "$25 to $100", "$100 to $500", "Over $500"],
      priceFilter: 0,
      checkbox: true,
    };
  },
};
</script>
