<template>
  <div>
    <v-card
      class="mx-auto mt-4 pa-12 pt-2 pb-8 mb-6"
      elevation="3"
      max-width="448"
      rounded="lg"
    >
      <v-img
        class="mx-auto my-6"
        max-width="160"
        src="../assets/logoKns.png"
      ></v-img>

      <div class="text-subtitle-1 text-medium-emphasis">Account</div>
      <v-form>
        <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="username"
          :rules="[rules.required]"
        ></v-text-field>

        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Password
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Forgot login password?</a
          >
        </div>

        <v-text-field
          v-model="password"
          :append-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append="visible = !visible"
          :rules="[rules.required]"
        ></v-text-field>

        <v-card class="mb-12" color="surface-variant" variant="tonal">
          <v-card-text class="text-medium-emphasis text-caption">
            Warning: After 3 consecutive failed login attempts, you account will
            be temporarily locked for three hours. If you must login now, you
            can also click "Forgot login password?" below to reset the login
            password.
          </v-card-text>
        </v-card>

        <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          :loading="isLoading"
          @click="loginSumbit()"
        >
          Log In
        </v-btn>
      </v-form>

      <div class="danger" v-if="errors.length">
        <v-alert dense type="error" v-for="error in errors" :key="error">{{
          error
        }}</v-alert>
      </div>
      <v-card-text class="text-center">
        <router-link
          class="text-blue text-decoration-none"
          to="signup"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </router-link>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      password: "",
      username: "",
      errors: [],
      isLoading: false,
      visible: false,
      rules: {
        email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
        username: (v) => !!(v || "") || "Please user name musn't be empty",
        password: (v) =>
          !!(v || "").match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) ||
          "Password must contain an upper case letter, a numeric character, and a special character",
        required: (v) => !!v || " This field is required",
      },
    };
  },
  mounted() {
    document.title = "Log In| KCS";
  },
  methods: {
    async loginSumbit() {
      this.errors = [];
      //first we remove all existings infos saved previously
      axios.defaults.headers.common["Authorization"] = "";
      localStorage.removeItem("token");
      this.isLoading = true;
      axios
        .post("kcs/api/token/login", {
          username: this.username,
          password: this.password,
          email: this.email,
        })

        .then((response) => {
          //then we get the token
          const token = response.data.auth_token;
          this.$store.commit("setToken", token);
          axios.defaults.headers.common["Authorization"] = "Token " + token;
          localStorage.setItem("token", token);

          //we send the user to cart or a desired root previously if the token is convenient
          const toPath = this.$route.query.to || "/";

          this.$router.push(toPath);
        })
        .catch((error) => {
          if (error.response) {
            for (const property in error.response.data) {
              this.errors.push("password or username incorrect");
            }
          } else {
            this.errors.push("Something went wrong. Please try again");
            console.log(JSON.stringify(error));
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
