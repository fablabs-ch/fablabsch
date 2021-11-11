<template>
  <Layout>
    <v-container>
      <div class="space-background-fill" />
      <section class="space">
        <v-sheet id="logo" elevation="1" :class="{'logo-sm': $vuetify.breakpoint.xs}">
          <v-img :src="spaceLogo($page.space)" alt="logo" />
        </v-sheet>
        <v-sheet class="pa-5" color="white" elevation="1">
          <h1 class="text-h3 font-weight-bold primary--text">
            {{ $page.space.name }}
          </h1>

          <v-row>
            <v-col class="space-info col-12 col-md-5">
              <p v-if="$page.space.website">
                <v-icon left>mdi-web</v-icon>
                <a :href="$page.space.website">{{ $page.space.website }}</a>
              </p>
              <p v-if="$page.space.facebook">
                <v-icon left>mdi-facebook</v-icon>
                <a :href="`https://facebook.com/${$page.space.facebook}`">{{
                  $page.space.facebook
                }}</a>
              </p>
              <p v-if="$page.space.twitter">
                <v-icon left>mdi-twitter</v-icon>
                <a :href="`https://twitter.com/${$page.space.twitter}`"
                  >@{{ $page.space.twitter }}</a
                >
              </p>
              <p v-if="$page.space.email">
                <v-icon left>mdi-email-outline</v-icon>
                <a :href="`mailto:${$page.space.email}`">{{
                  $page.space.email
                }}</a>
              </p>

              <p>
                <b>Founded:</b>
                {{
                  ($page.space.founded &&
                    new Date($page.space.founded).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })) ||
                  "?"
                }}
              </p>

              <p><b>Members:</b> ~{{ $page.space.members || "?" }}</p>

              <p>
                <b>Seen on Fablabs.io:</b>
                <a
                  :href="`http://fablabs.io/${$page.space.fablabsio}`"
                  target="_blank"
                  >{{ ($page.space.fablabsio && "yes") || "no" }}</a
                >
              </p>
              <p class="text-center">
                <v-btn
                  :href="`https://github.com/fablabs-ch/fablabsch/blob/main/${$page.space.fileInfo.path.replace('../', '')}`"
                  text
                  target="_blank"
                >
                  <v-icon left> mdi-github </v-icon> Edit on GitHub
                </v-btn>
              </p>
            </v-col>
            <v-col class="col-12 offset-md-1 col-md-6">
              <p v-html="description" />
              <h3 class="tetx-h4 my-3">Adresse</h3>
              <div class="space-map">
                <ClientOnly>
                  <l-map
                    v-if="
                      $page.space.latitude &&
                      $page.space.longitude &&
                      map &&
                      marker
                    "
                    :zoom="map.zoom"
                    :center="map.center"
                    :max-bounds="map.maxBounds"
                    :min-zoom="map.minZoom"
                    :max-zoom="map.maxZoom"
                  >
                    <l-tile-layer
                      :url="map.url"
                      :attribution="map.attribution"
                    />
                    <l-marker :lat-lng="marker.latLng" :icon="marker.icon" />
                  </l-map>
                </ClientOnly>
              </div>
              <p>
                <small
                  >{{ $page.space.street }}<br />
                  {{ $page.space.zip }} {{ $page.space.city }}</small
                >
              </p>
            </v-col>
          </v-row>

          <h2 id="machines" class="text-h4 mt-16">Machines</h2>
          <v-chip-group
            @change="$router.push(`/space/${$page.space.id}/#${$event}`)"
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
  </Layout>
</template>

<script>
import * as marked from "marked";
import machineTypes from "@/data/machine_types.yml";
import { spaceLogo, machineLogo } from "@/utils/fallback";
import MachineList from "@/components/MachineList.vue";

export default {
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
    MachineList,
  },
  data() {
    return {
      machineTypes,
      map: undefined,
      marked: undefined,
    };
  },
  computed: {
    description() {
      return marked.parse(this.$page.space.description);
    },
    groupedMachines() {
      return this.$page.space.machines.reduce(
        (groupedMachines, spaceMachine) => {
          const machine = Object.assign({}, spaceMachine.ref);
          // add custom properties
          machine.qty = spaceMachine.qty;
          machine.power = spaceMachine.power;
          machine.smId = spaceMachine.id;
          groupedMachines[spaceMachine.ref.type].push(machine);
          return groupedMachines;
        },
        Object.keys(machineTypes).reduce((groupedMachines, key) => {
          groupedMachines[key] = [];
          return groupedMachines;
        }, {})
      );
    },
  },
  watch: {
    $route() {
      if (process.isClient) {
        this.updateMap();
      }
    },
  },
  mounted() {
    this.updateMap();
  },
  methods: {
    spaceLogo,
    machineLogo,
    updateMap() {
      const leaflet = require("leaflet");
      this.map = {
        url: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        zoom: 12,
        minZoom: 7,
        maxZoom: 18,
        center: [this.$page.space.latitude, this.$page.space.longitude],
        maxBounds: leaflet.latLngBounds([
          [48.6991705, 4.6013578],
          [44.6715685, 11.2251619],
        ]),
      };
      this.marker = {
        id: this.$page.space.id,
        latLng: [this.$page.space.latitude, this.$page.space.longitude],
        icon: leaflet.icon({
          iconUrl: require("!!assets-loader!@/assets/fablab_marker_active.png")
            .src,
          iconSize: [48, 60],
          iconAnchor: [48 / 2, 60],
        }),
      };
    },
  },
  metaInfo() {
    return {
      title: this.$page.space.name,
    };
  },
};
</script>

<page-query>
query Space($id: ID!) {
  space: space(id: $id) {
    id
    fileInfo {
      path
      fallback
    }
    name
    description
    zip
    city
    country_code
    state_code
    latitude
    longitude
    street
    founded
    email
    website
    facebook
    twitter
    members
    fablabsio
    machines {
      ref {
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
        work_size
      }
      power
      qty
    }
  }
}
</page-query>
<style>
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

.space {
  padding-top: 150px;
  position: relative;
}
.space-map {
  height: 200px;
  width: 100%;
}
</style>
