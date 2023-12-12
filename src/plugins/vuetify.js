import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import "@mdi/font/css/materialdesignicons.css";
import fr from "vuetify/lib/locale/fr";
import en from "vuetify/lib/locale/en";
import colors from "vuetify/lib/util/colors";
Vue.use(Vuetify);
export default new Vuetify({
  icons: {
    defaultSet: "mdi",
  },

  lang: {
    locales: { fr, en },
    current: "fr",
  },

  theme: {
    themes: {
      light: {
        primary: colors.indigo,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3, 
        primaryMenu:colors.indigo, 
        extraMenu:colors.blueGrey
      },
      dark: {
        primary: "#FAFAFA",
        secondary: colors.grey.darken3, // Example secondary color for dark mode
        accent: colors.yellow.darken1, // Example accent color for dark mode 
        error: colors.red.accent2, // Example error color for dark mode
        primaryMenu:"#757575",
        extraMenu:colors.brown,


      },
    },
  },
});
