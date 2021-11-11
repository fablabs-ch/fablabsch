<template>
  <Layout>
    <v-container>
      <v-row class="justify-center">
        <v-card
          v-for="space in spaces"
          :key="space.id"
          :to="`/space/${space.id}`"
          width="200"
          class="ma-5"
        >
          <v-img :src="spaceLogo(space)" width="160" class="mx-auto" />
          <v-card-title>{{ space.name }}</v-card-title>
        </v-card>
      </v-row>
    </v-container>
  </Layout>
</template>

<script>
import { spaceLogo } from "@/utils/fallback";

export default {
  metaInfo: {
    title: "Labs",
  },
  data() {
    return {
      spaces: [],
    };
  },
  async mounted() {
    this.spaces = (await this.$fetch("/machines")).data.allSpace.edges.map(
      (node) => node.node
    );
  },
  methods: {
    spaceLogo,
  },
};
</script>
<style>
.links a {
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
</style>

