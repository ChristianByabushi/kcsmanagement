<template>
  <v-card-text>
    <h1 class="display-4 indigo yellow--text mt-5">Heading 1</h1>
    <h2 class="display-3 primary dark--text">Heading 2</h2>
    <h4 class="title">Title</h4>
    <h5 class="subtitle-1">Subtitle</h5>
    <p class="body-1">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam error
      quisquam, illum, accusantium cumque minus soluta itaque autem eos
      voluptatum dignissimos, vitae maiores accusamus officia voluptas ex
      excepturi laboriosam est?
    </p>

    <button fab v-ripple class="elevation-2 py-1 px-4">hey</button>

    <v-btn small block class="ml-2">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>
    <div>
      <h3>Grid</h3>
      <v-card class="mt-5 mb-8">
        <v-card-text>
          <v-row dense>
            <!-- for extra-small(xs) component with a width of 12 columns 
            and on extra-small 12 -->
            <v-col cols="12" sm="6">
              <v-card outlined tile class="pa-2">Hey</v-card>
            </v-col>
            <v-col cols="12" sm="6"
              ><v-card outlined class="pa-2">Dear</v-card></v-col
            >
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mx-auto" max-width="400" color="#26c6da" dark>
        <v-card-title>
          <v-icon large left> mdi-twitter </v-icon>
          <span class="title font-weight-light">Twitter</span>
        </v-card-title>

        <v-card-text class="headline font-weight-bold">
          "Vue Rocker"
        </v-card-text>

        <v-card-actions>
          <v-list-item class="grow">
            <v-list-item-avatar color="grey darken-3">
              <v-img
                class="elevation-6"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
              ></v-img>
            </v-list-item-avatar>

            <v-list-item-content >
              <v-list-item-title>Christian Byabushi</v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end">
              <v-icon class="mr-1">mdi-heart</v-icon>
              <span class="subheading mr-2">256</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1">mdi-share-variant</v-icon>
              <span class="subheading">45</span>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </div>
  </v-card-text>
</template>

<script>
import HelloWorld from "../components/HelloWorld";

export default {
  name: "Home",
  
  components: {
    HelloWorld,
  },
};
</script>
