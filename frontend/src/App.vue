<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary app style="z-index: 9999">
      <v-app-bar flat color="secondary" class="header-bar">
        <img src="/assets/logo.svg" width="40" height="40" class="mx-2" />
        <v-toolbar-title class="text-primary">Swiss FabLabs</v-toolbar-title>
      </v-app-bar>
      <div class="px-3 py-5">
        <Search />
      </div>
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          color="primary"
        >
          <v-list-item-title>{{ link.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar flat app color="secondary" class="header-bar">
      <v-app-bar-nav-icon
        class="text-primary"
        @click="drawer = !drawer"
      />
      <img src="/assets/logo.svg" width="40" height="40" class="mx-2" />
      <v-toolbar-title class="text-primary">Swiss FabLabs</v-toolbar-title>
      <v-spacer />
      <div class="d-none d-sm-flex">
        <Search />
      </div>
      <v-spacer class="d-none d-md-flex" />
      <v-btn
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        variant="text"
        color="primary"
        class="nav-btn d-none d-md-flex"
      >
        {{ link.label }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Search from './components/Search.vue'

export default {
  name: 'App',
  components: {
    Search,
  },
  data() {
    return {
      drawer: null,
      links: [
        { to: '/map/', label: 'Map' },
        { to: '/machines/', label: 'Machines' },
        { to: '/labs/', label: 'Labs' },
        { to: '/about/', label: 'About' },
      ],
    }
  },
}
</script>

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

.v-application a {
  color: var(--primary-color);
}
</style>
