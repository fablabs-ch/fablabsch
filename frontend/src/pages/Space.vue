<template>
  <v-container v-if="space">
    <div class="space-background-fill" />
    <section class="space">
      <v-sheet id="logo" elevation="1" :class="{ 'logo-sm': mobile }">
        <v-img :src="spaceLogo(space)" alt="logo" />
      </v-sheet>
      <v-sheet class="pa-5" color="white" elevation="1">
        <h1 class="text-h3 font-weight-bold text-primary">
          {{ space.name }}
        </h1>

        <v-row>
          <v-col class="space-info col-12 col-md-5">
            <p v-if="space.website">
              <v-icon>mdi-web</v-icon>
              <a :href="space.website">{{ space.website }}</a>
            </p>
            <p v-if="space.facebook">
              <v-icon>mdi-facebook</v-icon>
              <a :href="`https://facebook.com/${space.facebook}`">{{
                space.facebook
              }}</a>
            </p>
            <p v-if="space.twitter">
              <v-icon>mdi-twitter</v-icon>
              <a :href="`https://twitter.com/${space.twitter}`"
                >@{{ space.twitter }}</a
              >
            </p>
            <p v-if="space.email">
              <v-icon>mdi-email-outline</v-icon>
              <a :href="`mailto:${space.email}`">{{ space.email }}</a>
            </p>

            <p>
              <b>Founded:</b>
              {{
                (space.founded &&
                  new Date(space.founded).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })) ||
                '?'
              }}
            </p>

            <p><b>Members:</b> ~{{ space.members || '?' }}</p>

            <p>
              <b>Seen on Fablabs.io:</b>
              <a
                :href="`http://fablabs.io/${space.fablabsio}`"
                target="_blank"
              >
                {{ (space.fablabsio && 'yes') || 'no' }}</a
              >
            </p>
            <p class="text-center">
              <v-btn
                :href="`https://github.com/fablabs-ch/fablabsch/blob/main/${space.fileInfo.path.replace(
                  '../',
                  ''
                )}`"
                variant="text"
                target="_blank"
              >
                <v-icon>mdi-github</v-icon> Edit on GitHub
              </v-btn>
            </p>
          </v-col>
          <v-col class="col-12 offset-md-1 col-md-6">
            <div v-if="space.description" v-html="description" />
            <h3 class="text-h5 my-3">Address</h3>
            <div
              v-if="space.latitude && space.longitude"
              ref="mapContainer"
              class="space-map"
            />
            <p>
              <small
                >{{ space.street }}<br />
                {{ space.zip }} {{ space.city }}</small
              >
            </p>
          </v-col>
        </v-row>

        <h2 id="machines" class="text-h4 mt-16">Machines</h2>
        <v-chip-group
          @update:model-value="(val) => $router.push(`/space/${space.id}/#${val}`)"
        >
          <v-chip
            v-for="key in Object.keys(groupedMachines).filter(
              (key) => groupedMachines[key].length > 0
            )"
            :key="key"
            :value="key"
          >
            {{ machineTypes[key] }}
          </v-chip>
        </v-chip-group>
        <machine-list :grouped-machines="groupedMachines" />
      </v-sheet>
    </section>
  </v-container>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { marked } from 'marked'
import { loadData, getSpaceById, getMachineById } from '@/utils/dataLoader'
import machineTypes from '@/data/machine_types.yml'
import { spaceLogo } from '@/utils/fallback'
import MachineList from '@/components/MachineList.vue'
import L from 'leaflet'

export default {
  name: 'SpacePage',
  components: {
    MachineList,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { mobile } = useDisplay()
    const space = ref(null)
    const spaceMachines = ref([])
    const mapContainer = ref(null)
    const map = ref(null)

    const description = computed(() => {
      if (!space.value?.description) return ''
      return marked.parse(space.value.description)
    })

    const groupedMachines = computed(() => {
      if (!space.value) return {}
      
      const grouped = Object.keys(machineTypes).reduce(
        (groupedMachines, key) => {
          groupedMachines[key] = []
          return groupedMachines
        },
        {}
      )

      spaceMachines.value.forEach((sm) => {
        const machine = getMachineById(sm.ref)
        if (machine) {
          const enrichedMachine = {
            ...machine,
            qty: sm.qty,
            power: sm.power,
            smId: sm.id,
          }
          grouped[machine.type].push(enrichedMachine)
        }
      })

      return grouped
    })

    const initMap = () => {
      if (!space.value || !mapContainer.value) return
      if (!space.value.latitude || !space.value.longitude) return

      const leafletMap = L.map(mapContainer.value, {
        center: [space.value.latitude, space.value.longitude],
        zoom: 12,
        minZoom: 7,
        maxZoom: 18,
        maxBounds: L.latLngBounds([
          [48.6991705, 4.6013578],
          [44.6715685, 11.2251619],
        ]),
      })

      L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap)

      const iconUrl = new URL('@/assets/fablab_marker_active.png', import.meta.url).href
      const icon = L.icon({
        iconUrl,
        iconSize: [48, 60],
        iconAnchor: [24, 60],
      })

      L.marker([space.value.latitude, space.value.longitude], { icon }).addTo(
        leafletMap
      )

      map.value = leafletMap
    }

    const loadSpace = async () => {
      const data = await loadData()
      const spaceId = route.params.id
      space.value = getSpaceById(spaceId)
      
      if (!space.value) {
        router.push('/labs/')
        return
      }

      spaceMachines.value = data.spaceMachines.filter(
        (sm) => sm.spaceId === spaceId
      )

      // Wait for next tick to ensure DOM is ready
      setTimeout(initMap, 100)
    }

    onMounted(loadSpace)

    watch(() => route.params.id, loadSpace)

    return {
      space,
      spaceMachines,
      mobile,
      description,
      groupedMachines,
      machineTypes,
      spaceLogo,
      mapContainer,
    }
  },
}
</script>

<style scoped>
.space-background-fill {
  background-color: #e10707;
  height: 300px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

#logo {
  width: 160px;
  height: 160px;
  position: absolute;
  right: 50px;
  top: 80px;
}

#logo.logo-sm {
  top: 80px;
  right: 20px;
  width: 100px;
  height: 100px;
}

.space-info p {
  margin: 0 0 1em 0;
}
.space-info p b {
  margin-right: 8px;
}

.space {
  padding-top: 150px;
  position: relative;
}
.space-map {
  height: 200px;
  width: 100%;
}
</style>
