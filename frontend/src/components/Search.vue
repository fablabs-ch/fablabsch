<template>
  <v-autocomplete
    ref="input"
    v-model="search"
    :items="items"
    return-object
    :item-text="toFullText"
    item-value="name"
    hide-details
    solo
    flat
    dense
    placeholder="Search"
    prepend-inner-icon="mdi-magnify"
    background-color="grey lighten-5"
    style="z-index: 9999"
    @input="goTo($event)"
  >
    <template #item="data">
      <v-list-item-avatar tile>
        <v-img
          v-if="data.item.__type === 'space'"
          :src="spaceLogoThumb(data.item)"
        />
        <v-img
          v-if="data.item.__type === 'machine'"
          :src="machineLogoThumb(data.item)"
        />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          v-if="data.item.__type === 'space'"
          v-text="data.item.name"
        />
        <v-list-item-title v-if="data.item.__type === 'machine'">
          {{ data.item.name }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="data.item.__type === 'machine'">
          {{ data.item.vendor.id }}
          {{ machineTypes[data.item.type] }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
import machineTypes from "@/data/machine_types.yml";
import machineId from "@/utils/machineId";
import { spaceLogoThumb, machineLogoThumb } from "@/utils/fallback";

export default {
  data() {
    return {
      search: null,
      machineTypes,
    };
  },
  computed: {
    items() {
      const spaces = this.$static.allSpace.edges.map(({ node }) => {
        node.__type = "space";
        return node;
      });
      const machines = this.$static.allMachine.edges.map(({ node }) => {
        node.__type = "machine";
        return node;
      });
      return spaces.concat(machines);
    },
  },
  methods: {
    goTo(item) {
      if (item.__type === "space") {
        this.$router.push(`/space/${item.id}`);
      }
      if (item.__type === "machine") {
        this.$router.push(`/machines/#${machineId(item.id)}`);
      }
      setTimeout(() => {
        this.search = null;
        this.$refs.input?.blur();
      });
    },
    toFullText(item) {
      if (item.__type === "space") {
        return item.name.normalize("NFD").replace(/\p{Diacritic}/gu, "");
      }
      if (item.__type === "machine") {
        return `${this.machineTypes[item.type]} ${item.name} ${item.vendor.id}`
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
      }
    },
    spaceLogoThumb,
    machineLogoThumb,
  },
};
</script>
<static-query>
query {
  allSpace(sortBy: "name", order: ASC) {
    edges {
      node {
        id
        name
        fileInfo {
          subfolder
          fallback
        }
      }
    }
  }
  allMachine(sortBy: "name", order: ASC) {
    edges {
      node {
        id
        name
        type
        vendor {
          id
        }
        fileInfo {
          subfolder
          fallback
        }
      }
    }
  }
}
</static-query>
