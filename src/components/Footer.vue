<template>
  <v-footer dense dark align="center">
    <v-card-text class="white--text">
      {{ new Date().getFullYear() }} —
      <strong>Copyright Kivu-Consulting-Service All right reserved </strong>
    </v-card-text>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
};
</script>
