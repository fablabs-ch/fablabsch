<template>
  <v-container fluid class="pa-0 fill-height large-map">
    <div ref="mapContainer" class="map-container" />
  </v-container>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { loadData } from '@/utils/dataLoader'
import { spaceLogo } from '@/utils/fallback'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ICON_INITIAL_SIZE = 48

export default {
  name: 'MapPage',
  setup() {
    const router = useRouter()
    const mapContainer = ref(null)
    const map = ref(null)
    const markers = ref([])

    const goTo = (id) => {
      router.push(`/space/${id}`)
    }

    onMounted(async () => {
      const data = await loadData()
      
      // Wait for next tick to ensure DOM is ready
      await nextTick()
      
      if (!mapContainer.value) {
        console.error('Map container not found')
        return
      }
      
      // Initialize map
      const leafletMap = L.map(mapContainer.value, {
        center: [46.8, 8.2],
        zoom: 8,
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

      // Add markers
      data.spaces
        .filter((space) => space.latitude && space.longitude)
        .forEach((space) => {
          const icon = L.icon({
            iconUrl: spaceLogo(space),
            iconSize: [ICON_INITIAL_SIZE, ICON_INITIAL_SIZE],
            iconAnchor: [ICON_INITIAL_SIZE / 2, ICON_INITIAL_SIZE / 2],
          })

          const marker = L.marker([space.latitude, space.longitude], { icon })
            .bindTooltip(space.name, { offset: [32, 0] })
            .on('click', () => goTo(space.id))
            .addTo(leafletMap)

          markers.value.push(marker)
        })

      map.value = leafletMap
    })

    return {
      mapContainer,
      map,
      markers,
    }
  },
}
</script>

<style scoped>
.large-map {
  height: calc(100vh - 64px);
}

.map-container {
  width: 100%;
  height: 100%;
}
</style>

<style>
.large-map .leaflet-marker-icon {
  background-color: #fff;
  box-shadow: rgba(17, 17, 26, 0.25) 0px 4px 16px,
    rgba(17, 17, 26, 0.25) 0px 8px 32px;
}
</style>
