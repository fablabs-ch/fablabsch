<template>
  <v-autocomplete
    ref="input"
    v-model="search"
    :items="items"
    return-object
    :custom-filter="customFilter"
    hide-details
    density="compact"
    variant="solo"
    flat
    placeholder="Search"
    prepend-inner-icon="mdi-magnify"
    bg-color="grey-lighten-4"

    @update:model-value="goTo($event)"
  >
    <template v-slot:item="{ props, item }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <v-avatar v-if="item.raw.__type === 'space'">
            <v-img :src="spaceLogoThumb(item.raw)" />
          </v-avatar>
          <v-avatar v-if="item.raw.__type === 'machine'">
            <v-img :src="machineLogoThumb(item.raw)" />
          </v-avatar>
        </template>
        <template v-if="item.raw.__type === 'machine'">
          <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ item.raw.vendor }} - {{ machineTypes[item.raw.type] }}
          </v-list-item-subtitle>
        </template>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { loadData } from '@/utils/dataLoader'
import machineTypes from '@/data/machine_types.yml'
import machineId from '@/utils/machineId'
import { spaceLogoThumb, machineLogoThumb } from '@/utils/fallback'

export default {
  name: 'SearchComponent',
  setup() {
    const router = useRouter()
    const search = ref(null)
    const input = ref(null)
    const spaces = ref([])
    const machines = ref([])

    const items = computed(() => {
      const spaceItems = spaces.value.map((space) => ({
        ...space,
        __type: 'space',
        title: space.name,
      }))
      const machineItems = machines.value.map((machine) => ({
        ...machine,
        __type: 'machine',
        title: `${machineTypes[machine.type]} ${machine.name} ${machine.vendor}`,
      }))
      return [...spaceItems, ...machineItems]
    })

    const customFilter = (value, query, item) => {
      if (!query) return true
      const searchText = query.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      const itemText = item.raw.title.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
      return itemText.includes(searchText)
    }

    const goTo = (item) => {
      if (!item) return
      
      if (item.__type === 'space') {
        router.push(`/space/${item.id}`)
      } else if (item.__type === 'machine') {
        router.push(`/machines/#${machineId(item.id)}`)
      }
      
      setTimeout(() => {
        search.value = null
        input.value?.blur()
      }, 100)
    }

    onMounted(async () => {
      const data = await loadData()
      spaces.value = data.spaces
      machines.value = data.machines
    })

    return {
      search,
      input,
      items,
      machineTypes,
      customFilter,
      goTo,
      spaceLogoThumb,
      machineLogoThumb,
    }
  },
}
</script>
