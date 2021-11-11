<template>
  <Layout>
    <v-container class="pb-16">
      <VueRemarkContent />
    </v-container>
  </Layout>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: this.$page.mdPage.title,
    };
  },
};
</script>

<page-query>
query MdPage($id: ID!) {
  mdPage(id: $id) {
    id
    title
  }
}
</page-query>
