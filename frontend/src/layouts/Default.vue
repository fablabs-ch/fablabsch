<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary app style="z-index: 9999">
      <v-app-bar flat color="secondary" class="header-bar">
        <g-image src="~/assets/logo.svg" width="40" height="40" class="mx-2" />
        <v-toolbar-title class="primary--text">
          {{ $static.metadata.siteName }}
        </v-toolbar-title>
      </v-app-bar>
      <search class="px-3 py-5" />
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          color="primary"
          class="nav-item"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ link.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar flat app color="secondary" class="header-bar">
      <v-app-bar-nav-icon class="primary--text" @click="drawer = !drawer" />
      <g-image src="~/assets/logo.svg" width="40" height="40" class="mx-2" />
      <v-toolbar-title class="primary--text">
        {{ $static.metadata.siteName }}
      </v-toolbar-title>
      <v-spacer />
      <search class="d-none d-sm-flex" />
      <v-spacer
        class="d-none d-md-flex"
      />
      <v-btn
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        tile
        text
        color="primary"
        class="nav-btn d-none d-md-flex"
      >
        {{ link.label }}
      </v-btn>
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>
<script>
import Search from '~/components/Search.vue'
export default {
  components: {
    Search
  },
  data() {
    return {
      drawer: null,
      links: [
        { to: "/", label: "News" },
        { to: "/events/", label: "Events" },
        { to: "/map/", label: "Map" },
        { to: "/machines/", label: "Machines" },
        { to: "/labs/", label: "Labs" },
        { to: "/about/", label: "About" },
      ],
    };
  },
};
</script>
<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<style>
:root {
  --primary-color: #e10707;
}

.header-bar {
  z-index: 9999 !important;
}

.header-bar .v-toolbar__content {
  border-top: 5px solid var(--primary-color);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

h1,
h2 {
  margin-top: 1em;
  margin-bottom: 1em;
}

h1:first-child {
  margin-top: 0;
}

.v-application p {
  margin-bottom: 0.5em;
}

dt {
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 0.25em;
}

dd {
  margin-inline-start: 40px;
}

.nav-item {
  text-transform: uppercase;
}

.nav-btn {
  margin-top: -4px;
  height: calc(100% + 8px) !important;
  margin-bottom: -4px;
}
.nav-btn.v-btn--active:before {
  display: none;
}
.nav-btn.v-btn--active:after {
  border-bottom: 3px solid var(--primary-color);
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
