<template>
  <v-container>
    <v-row>
      <v-col lg="6" cols="12">
        <img
          width="100%"
          height="100%"
          src="@/assets/img/carousel-2.jpg"
          alt=""
        />
      </v-col>

      <v-col lg="6">
        <v-subheader class="text-h4">About Us</v-subheader>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Reprehenderit, illo unde ipsum numquam deserunt debitis enim deleniti
          iusto corrupti dolore optio consectetur. Illum, possimus? Repellendus
          inventore delectus vero magni cupiditate!
        </p>
        <v-list>
          <v-list-item>
            <v-icon color="success">mdi-check-all</v-icon>
            <v-list-item-subtitle
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae
              autem voluptatem hic quos, quaerat aperiam ex veniam
              ?</v-list-item-subtitle
            >
          </v-list-item>

          <v-list-item>
            <v-icon color="success">mdi-check-all</v-icon>
            <v-list-item-subtitle
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae
              autem voluptatem hic quos, quaerat aperiam ex veniam
              ?</v-list-item-subtitle
            >
          </v-list-item>

          <v-list-item>
            <v-icon color="success">mdi-check-all</v-icon>
            <v-list-item-subtitle
              >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae
              autem voluptatem hic quos, quaerat aperiam ex veniam et? Tenetur
              nulla architecto nisi accusantium facere ea ab, optio dolores
              nobis ipsum?</v-list-item-subtitle
            >
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AboutComponent",
};
</script>
