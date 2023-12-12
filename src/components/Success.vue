<template>
  <div style="margin-bottom: 23rem;">
    <v-card elevation="0" class=" mx-auto pa-2 ma-7" max-width="700px">
      <h2 title align="center">Thank you</h2>
      <v-alert shaped prominent type="success">
        Your order will be processed in 48 hours
      </v-alert>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Success",
  mounted() {
    document.title = "Success |KCS";
  },
};
</script>
