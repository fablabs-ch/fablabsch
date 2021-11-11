<template>
  <Layout>
    <v-container class="text-center">
      <v-card
        height="400"
        color="transparent"
        flat
      >
        <div class="display-3 my-6">
          404 Page not found.
        </div>
        <div class="grey--text lighten-5">
          The page you are trying to get to never existed in this reality, or
          has migrated to a parallel universe.
        </div>
        <div class="paragraph-text mt-2">
          <br>
          <br>Try going back to home page and repeating your action. Or, help
          create it on <a href="TODO project url">GitHub</a>
        </div>
      </v-card>
    </v-container>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: '404 Page not Found'
  }
}
</script>
