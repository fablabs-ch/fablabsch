<template>
  <Layout>
    <v-container fluid class="pa-0 fill-height large-map">
      <ClientOnly>
        <l-map
          v-if="map"
          :zoom="map.zoom"
          :center="map.center"
          :max-bounds="map.maxBounds"
          :min-zoom="map.minZoom"
          :max-zoom="map.maxZoom"
          @update:zoom="onZoomChange"
        >
          <l-tile-layer :url="map.url" :attribution="map.attribution" />
          <l-marker
            v-for="marker in markers"
            :key="marker.id"
            :name="marker.name"
            :lat-lng="marker.latLng"
            :icon="marker.icon"
            @click="goTo(marker.id)"
          >
            <l-tooltip :options="{ offset: [32, 0] }">
              {{ marker.name }}
            </l-tooltip>
          </l-marker>
        </l-map>
      </ClientOnly>
    </v-container>
  </Layout>
</template>

<script>
import { spaceLogo } from '@/utils/fallback';

const ICON_INITIAL_SIZE = 48;

export default {
  metaInfo: {
    title: "Map",
  },
  components: {
    LMap: () =>
      import("vue2-leaflet")
        .then((m) => m.LMap)
        .catch(),
    LTileLayer: () =>
      import("vue2-leaflet")
        .then((m) => m.LTileLayer)
        .catch(),
    LMarker: () =>
      import("vue2-leaflet")
        .then((m) => m.LMarker)
        .catch(),
    LTooltip: () =>
      import("vue2-leaflet")
        .then((m) => m.LTooltip)
        .catch()
  },
  data() {
    return {
      map: undefined,
      markers: [],
    };
  },
  mounted() {
    const leaflet = require("leaflet");
    this.markers = this.$page.allSpace.edges
      .filter(({ node }) => node.latitude && node.longitude)
      .map(({ node }) => {
        return {
          id: node.id,
          latLng: [node.latitude, node.longitude],
          name: node.name,
          icon: leaflet.icon({
            iconUrl: spaceLogo(node),
            iconSize: [ICON_INITIAL_SIZE, ICON_INITIAL_SIZE],
            iconAnchor: [ICON_INITIAL_SIZE / 2, ICON_INITIAL_SIZE / 2],
          }),
        };
      });
    this.map = {
      url: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 9,
      minZoom: 7,
      maxZoom: 14,
      center: [46.94257184670688, 7.9578],
      maxBounds: leaflet.latLngBounds([
        [48.6991705, 4.6013578],
        [44.6715685, 11.2251619],
      ]),
    };
  },
  methods: {
    goTo(id) {
      this.$router.push(`/space/${id}`);
    },
    onZoomChange(zoom) {
      // update icon size
      [...document.querySelectorAll(".leaflet-marker-icon")].forEach((el) => {
        const size = (ICON_INITIAL_SIZE * zoom) / 9;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.marginLeft = `-${size / 2}px`;
        el.style.marginTop = `-${size / 2}px`;
      });
    },
    spaceLogo,
  },
};
</script>
<page-query>
query {
  allSpace(sortBy: "name", order: ASC) {
    totalCount
    edges {
      node {
        id
        name
        fileInfo {
          fallback
        }
        latitude
        longitude
      }
    }
  }
}
</page-query>
<style>
.large-map .leaflet-marker-icon {
  background-color: #fff;
  box-shadow: rgba(17, 17, 26, 0.25) 0px 4px 16px,
    rgba(17, 17, 26, 0.25) 0px 8px 32px;
}
.map-legend {
  position: absolute;
  width: 250px;
  top: 20px;
  right: 20px;
  max-height: 80vh;
  z-index: 999;
}
</style>