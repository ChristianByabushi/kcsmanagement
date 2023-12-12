<template>
  <v-container class="pt-15">
    <v-row>
      <v-col cols="12" lg="6">
        <h2 class="intro-text">Welcome to Humanatm Website</h2>
        <p class="description">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum
          sequi ipsa alias amet numquam? Laborum pariatur ab quo corporis
          nostrum deserunt voluptatum expedita! Consequuntur quibusdam fugit
          enim sapiente consectetur distinctio?
        </p>
        <v-btn color="success mr-2" class="white--text" rounded>Get Started</v-btn>
        <v-btn color="indigo" class="white--text" rounded>
          <v-icon>mdi-play-circle</v-icon>
          Watch Video
        </v-btn>
      </v-col>

      <v-col cols="12" lg="6">
        <img width="100%" src="@/assets/img/carousel-1.jpg" alt="" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default{
    name:"HeroComponent"
}
</script>

<style scoped>
h2.intro-text {
    font-size: 50px;
    font-weight: bold;
    font-family:cursive; 
    color: #444;
}

p.description{
    font-size: 19px;
    font-family: cursive;
    margin: 32px 0px;
    color:#444444ba

}
</style>