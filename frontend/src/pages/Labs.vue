<template>
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
</template>

<script>
import { ref, onMounted } from 'vue'
import { loadData } from '@/utils/dataLoader'
import { spaceLogo } from '@/utils/fallback'

export default {
  name: 'LabsPage',
  setup() {
    const spaces = ref([])

    onMounted(async () => {
      const data = await loadData()
      spaces.value = data.spaces.sort((a, b) => a.name.localeCompare(b.name))
    })

    return {
      spaces,
      spaceLogo,
    }
  },
}
</script>

<style scoped>
.v-card {
  text-decoration: none;
}
</style>

