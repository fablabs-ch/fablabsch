<template>
  <Layout>
    <v-container>
      <a ref="timeline" class="twitter-timeline" href="https://twitter.com/borisfritscher/lists/fablabs-ch?ref_src=twsrc%5Etfw">A Twitter List of Swiss FabLabs</a>
    </v-container>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: "News",
  },
  data() {
    return {
    };
  },
  mounted() {
    const scriptTagTheme = document.createElement("script")
    scriptTagTheme.src = "https://platform.twitter.com/widgets.js"
    this.$refs.timeline.parentNode.appendChild(scriptTagTheme)
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: ease opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.links a {
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
</style>
