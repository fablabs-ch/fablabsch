// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import "leaflet/dist/leaflet.css";
import "vuetify/dist/vuetify.min.css";
import Vuetify from "vuetify/lib/framework";
import { VBtn } from "vuetify/lib";
import DefaultLayout from "~/layouts/Default.vue";

export default function(Vue, { appOptions, head, router }) {
  head.link.push({
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900",
  });

  head.link.push({
    rel: "stylesheet",
    href:
      "https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css",
  });

  router.options.scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            selector: decodeURIComponent(to.hash),
            offset: {x: 0, y: 100},
            behavior: "smooth",
            });
        }, 100);
      });
    } else {
      return { x: 0, y: 0, behavior: "smooth" };
    }
  };

  Vue.use(Vuetify, {
    components: {
      VBtn, // Global import of Vuetify's VBtn component for MdPages
    },
  });

  if (process.isClient) {
    const VueMasonryPlugin = require("vue-masonry").VueMasonryPlugin;
    Vue.use(VueMasonryPlugin);
  }

  appOptions.vuetify = new Vuetify({
    theme: {
      themes: {
        light: {
          primary: "#E10707",
          secondary: "#FFFFFF",
          /*
          accent: "#82B1FF",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107"
          */
        },
      },
    },
  });

  // Set default layout as a global component
  Vue.component("Layout", DefaultLayout);
}
