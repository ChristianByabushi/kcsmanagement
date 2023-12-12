<template>
  <v-container>
    <v-row justify="center">
      <v-col lg="12" class="text-center justify--center">
        <v-subheader class="text-h4 justify-center">Portfolio</v-subheader>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste impedit,
          ducimus ab quibusdam quas reprehenderit molestias cumque non, omnis
          sapiente iure debitis
        </p>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" class="text-center justify-center">
        <v-chip
          class="ma-1"
          :color="activetedApp === 'webapp' ? 'success' : ''"
          @click="activetedApp = 'webapp'"
        >
          Web apps
        </v-chip>
        <v-chip
          class="ma-1"
          :color="activetedApp === 'mobileapp' ? 'success' : ''"
          @click="activetedApp = 'mobileapp'"
        >
          Mobile apps</v-chip
        >
        <v-chip
          class="ma-1"
          @click="activetedApp = 'iosapp'"
          :color="activetedApp === 'iosapp' ? 'success' : ''"
        >
          Ios apps
        </v-chip>
      </v-col>
    </v-row>
    <slot v-if="activetedApp == 'webapp'">
      <v-row>
        <v-col
          cols="6"
          md="3"
          v-for="item in webapps"
          :key="item.index"
          offset-y="1"
        >
          <v-card>
            <v-img
              height="200px"
              :src="item.image"
              alt=""
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0, .1), rgba(0,0,0, .5)"
            />
            <v-card-title>{{ item.title }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </slot>
  </v-container>
</template>

<script>
import colors from "vuetify/lib/util/colors";

export default {
  data: () => ({
    activetedApp: "webapp",
    webapps: [
      {
        title: "MobileApp1",
        image: "../assets/img/fact-4.jpg",
      },
      {
        title: "MobileApp2",
        image: "../assets/img/fact-3.jpg",
      },
      {
        title: "MobileApp3",
        image: "../assets/img/fact-1.jpg",
      },
      {
        title: "MobileApp4",
        image: "../assets/img/fact-2.jpg",
      },
    ],
  }),
};
</script>
