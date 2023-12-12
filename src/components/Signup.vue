<template>
  <v-card class="mx-auto mb-6 mt-6" align="center" style="max-width: 450px">
    <v-toolbar color="dark accent-2" cards dark flat>
      <v-card-title class="text-h6 font-weight-regular"> Sign up </v-card-title>
    </v-toolbar>
    <v-form ref="form" v-model="form" class="pa-4 pt-6">
      <v-text-field
        v-model="username"
        :rules="[rules.username]"
        filled
        color="deep-purple"
        label="UserName"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="[rules.password, rules.length(6)]"
        filled
        color="deep-purple"
        counter="6"
        label="Password"
        style="min-height: 96px"
        type="password"
      ></v-text-field>
      <v-text-field
        v-model="password2"
        :rules="[rules.password2]"
        filled
        color="deep-purple"
        counter="6"
        label="Repeat password"
        style="min-height: 96px"
        type="password"
      ></v-text-field>
      <v-text-field
        v-model="phone"
        filled
        color="deep-purple"
        label="Phone Number"
      ></v-text-field>
      <v-text-field
        v-model="email"
        :rules="[rules.email]"
        filled
        color="deep-purple"
        label="Email address"
        type="email"
      ></v-text-field>
      <router-link justify-left to="/login"
        >Click 1000 if you have an account</router-link
      >
      <v-divider></v-divider>
      <div class="danger" v-if="errors.length">
        <v-alert type="error" v-for="error in errors" :key="error">{{
          error
        }}</v-alert>
      </div>
      <Alert ref="childAlert" :toastVisible="toastVisible" :msg="msgAlert">
      </Alert>

      <v-checkbox
        v-model="agreement"
        :rules="[rules.required]"
        color="deep-purple"
      >
        <template v-slot:label>
          I agree to the&nbsp;
          <a href="#" @click.stop.prevent="dialog = true">Terms of Service</a>
          &nbsp;and&nbsp;
          <a href="#" @click.stop.prevent="dialog = true">Privacy Policy</a>*
        </template>
      </v-checkbox>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn text @click="$refs.form.reset()"> Clear </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!form"
          :loading="isLoading"
          class="white--text"
          color="deep-purple accent-4"
          depressed
          @click="submitForm()"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-form>

    <v-dialog v-model="dialog" absolute max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h5 grey lighten-3"> Legal </v-card-title>
        <v-card-text>
          Certainly! Let's use an example e-commerce marketplace called
          "ShopifyMart" for the privacy policy. Here's an updated version with
          the marketplace name: Privacy Policy Last updated: [Date] ShopifyMart
          ("us", "we", or "our") operates the ShopifyMart website (the
          "Service"). This page informs you of our policies regarding the
          collection, use, and disclosure of Personal Information when you use
          our Service. We will not use or share your information with anyone
          except as described in this Privacy Policy. We use your Personal
          Information for providing and improving the Service. By using the
          Service, you agree to the collection and use of information in
          accordance with this policy. Unless otherwise defined in this Privacy
          Policy, terms used in this Privacy Policy have the same meanings as in
          our Terms and Conditions. Information Collection and Use While using
          our Service, we may ask you to provide us with certain personally
          identifiable information that can be used to contact or identify you.
          Personally identifiable information may include, but is not limited
          to, your email address, name, phone number, postal address, and
          payment information ("Personal Information"). Log Data We collect
          information that your browser sends whenever you visit our Service
          ("Log Data"). This Log Data may include information such as your
          computer's Internet Protocol ("IP") address, browser type, browser
          version, the pages of our Service that you visit, the time and date of
          your visit, the time spent on those pages, and other statistics.
          Cookies Cookies are files with a small amount of data, which may
          include an anonymous unique identifier. Cookies are sent to your
          browser from a web site and stored on your computer's hard drive. We
          use "cookies" to collect information. You can instruct your browser to
          refuse all cookies or to indicate when a cookie is being sent.
          However, if you do not accept cookies, you may not be able to use some
          portions of our Service. Service Providers We may employ third-party
          companies and individuals to facilitate our Service, to provide the
          Service on our behalf, to perform Service-related services, or to
          assist us in analyzing how our Service is used. These third parties
          have access to your Personal Information only to perform these tasks
          on our behalf and are obligated not to disclose or use it for any
          other purpose. Security The security of your Personal Information is
          important to us, but remember that no method of transmission over the
          Internet or method of electronic storage is 100% secure. While we
          strive to use commercially acceptable means to protect your Personal
          Information, we cannot guarantee its absolute security. Links to Other
          Sites Our Service may contain links to other sites that are not
          operated by us. If you click on a third-party link, you will be
          directed to that third party's site. We strongly advise you to review
          the Privacy Policy of every site you visit. We have no control over
          and assume no responsibility for the content, privacy policies, or
          practices of any third-party sites or services. Children's Privacy Our
          Service does not address anyone under the age of 18 ("Children"). We
          do not knowingly collect personally identifiable information from
          children under 18. If you are a parent or guardian and you are aware
          that your Children has provided us with Personal Information, please
          contact us. If we discover that a Children under 18 has provided us
          with Personal Information, we will delete such information from our
          servers immediately. Changes to This Privacy Policy We may update our
          Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page. You are advised to review
          this Privacy Policy periodically for any changes. Changes to this
          Privacy Policy are effective when they are posted on this page.
          Contact Us If you have any questions about this Privacy Policy, please
          contact us. By using our Service, you acknowledge that you have
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text @click="(agreement = false), (dialog = false)">
            No
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            color="deep-purple accent-4"
            @click="(agreement = true), (dialog = false)"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from "axios";
import Alert from "@/components/Alert.vue";
export default {
  components: {
    Alert,
  },
  data() {
    return {
      msgAlert: "",
      toastVisible: false,
      errors: [],
      agreement: false,
      dialog: false,
      email: undefined,
      username: undefined,
      form: false,
      isLoading: false,
      password: undefined,
      password2: undefined,
      phone: undefined,
      rules: {
        email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
        username: (v) => !!(v || "") || "Please user name musn't be empty",
        length: (len) => (v) =>
          (v || "").length >= len ||
          `Invalid character length, required ${len}`,
        password: (v) =>
          !!(v || "").match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) ||
          "Password must contain an upper case letter, a numeric character, and a special character",
        password2: (v) =>
          (!!(v || "").match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) &&
            v === this.password) ||
          "Passwords do not match or do not meet requirements",
        required: (v) => !!v || " This field is required",
      },
    };
  },

  methods: {
    submitForm() {
      this.$refs.form.validate();
      this.errors = [];
      this.isLoading = true;
      axios
        .post("api/v1/users/", {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.toastVisible = true;
          this.msgAlert = "Account created successfully, please log in !";
          this.$refs.childAlert.setValueFromParent(
            this.toastVisible,
            this.msgAlert
          );
          this.$router.push("/login");
        })
        .catch((error) => {
          if (error.response) {
            for (const property in error.response.data) {
              this.errors.push(
                `${property} : ${error.response.data[property]}`
              );
            }
            console.log(JSON.stringify(error.response.data));
          } else if (error.message) {
            for (i in error) {
              console.log(i);
            }
            this.errors.push("Something went wrong, Please try again");
            console.log(JSON.stringify(error.message));
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>
