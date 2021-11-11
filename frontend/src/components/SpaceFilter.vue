<template>
  <v-speed-dial
    v-model="fab"
    top
    right
    direction="left"
    :open-on-hover="false"
    transition="slide-x-reverse-transition"
    absolute
  >
    <template #activator>
      <v-badge overlap :content="countVisible()" :value="!allSpaceVisible()">
        <v-btn v-model="fab" color="primary" fab>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-filter-outline </v-icon>
        </v-btn>
      </v-badge>
    </template>
    <v-btn
      v-for="space in spaces"
      :key="space.id"
      fab
      raised
      :color="filteredSpaces[space.id] ? 'primary' : 'white'"
      :title="space.name"
      @click.stop="toggleSpaceFilter(space.id)"
    >
      <v-avatar :class="{ hidden: !filteredSpaces[space.id] }">
        <img :src="spaceLogoThumb(space)" />
      </v-avatar>
    </v-btn>
    <v-btn fab @click.stop="setSpaceFilterAll(true, true)"> ALL </v-btn>
  </v-speed-dial>
</template>
<script>
import { spaceLogoThumb } from "@/utils/fallback";
const FILTER_SPACE_KEY = "filter_space";

export default {
  data() {
    return {
      fab: false,
      spaces: [],
      filteredSpaces: {},
    };
  },
  async mounted() {
    const results = await this.$fetch("/map");
    this.spaces = results.data.allSpace.edges.map(({ node }) => node);
    const rawFilter = localStorage.getItem(FILTER_SPACE_KEY);
    if (rawFilter) {
      try {
        this.filteredSpaces = JSON.parse(rawFilter);
      } catch (e) {
        console.error(e);
      }
    }
    // update
    const existingSpaces = [];
    // add new spaces
    this.spaces.forEach((s) => {
      existingSpaces.push(s.id);
      if (!Object.prototype.hasOwnProperty.call(this.filteredSpaces, s.id)) {
        // by default display new spaces
        this.$set(this.filteredSpaces, s.id, true);
      }
    });
    // remove spaces that are no longer in the list
    Object.keys(this.filteredSpaces).forEach((key) => {
      if (!existingSpaces.includes(key)) {
        delete this.filteredSpaces[key];
      }
    });
    this.saveFilter();
  },
  methods: {
    saveFilter() {
      this.$emit("filteredSpaces", this.filteredSpaces);
      localStorage.setItem(
        FILTER_SPACE_KEY,
        JSON.stringify(this.filteredSpaces)
      );
    },
    allSpaceVisible() {
      return Object.keys(this.filteredSpaces).every(
        (key) => this.filteredSpaces[key]
      );
    },
    countVisible() {
      return Object.values(this.filteredSpaces).filter( v => v).length;
    },
    noSpaceVisible() {
      return Object.keys(this.filteredSpaces).every(
        (key) => !this.filteredSpaces[key]
      );
    },
    setSpaceFilterAll(visible, save = false) {
      Object.keys(this.filteredSpaces).forEach((key) => {
        this.filteredSpaces[key] = visible;
      });
      if (save) {
        this.saveFilter();
      }
    },
    toggleSpaceFilter(spaceId) {
      let visible = this.filteredSpaces[spaceId];
      if (this.allSpaceVisible()) {
        this.setSpaceFilterAll(false);
        visible = !visible;
      }
      this.filteredSpaces[spaceId] = !visible;
      if (this.noSpaceVisible()) {
        this.setSpaceFilterAll(true);
      }
      this.saveFilter();
    },
    spaceLogoThumb,
  },
};
</script>
<style>
.hidden {
  opacity: 0.2;
}
.hidden:hover {
  opacity: 1;
}
.v-speed-dial__list {
  flex-wrap: wrap;
  width: 90vw;
}
</style>
