<template>
  <Layout>
    <v-container>
      <ClientOnly>
        <space-filter @filteredSpaces="onFilteredSpaces" />
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="$refs.calendar.prev()"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            color="grey darken-2"
            @click="$refs.calendar.next()"
          >
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer />
        </v-toolbar>
        <v-calendar
          :key="calendarId"
          ref="calendar"
          v-model="focus"
          :events="events"
          type="month"
          color="primary"
          weekdays="1, 2, 3, 4, 5, 6, 0"
          event-start="startdate"
          event-end="enddate"
          event-name="summary"
          event-color="grey lighten-3"
          event-text-color="black"
          :event-height="22"
          style="min-height: 75vh;"
          @change="updateRange"
          @click:event="showEvent"
        >
          <template #event="{ event }">
            <v-avatar size="16">
              <img
                :src="
                  spaceLogoThumb({
                    id: event.space.slug,
                    fileInfo: { fallback: false },
                  })
                "
              >
            </v-avatar>
            <span class="v-event-summary">
              <strong>{{ event.summary }}</strong></span>
          </template>
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card v-if="selectedEvent" min-width="300px" max-width="540px" flat>
            <v-list-item dense>
              <v-list-item-avatar>
                <v-btn :to="`/space/${selectedEvent.space.slug}`" icon tile>
                  <img
                    :src="
                      spaceLogoThumb({
                        id: selectedEvent.space.slug,
                        fileInfo: { fallback: false },
                      })
                    "
                  >
                </v-btn>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{
                    selectedEvent.space.name
                  }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span>{{
                    selectedEvent.startdate.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })
                  }}
                  </span>

                  <span v-if="selectedEvent.hasStartDateTime">{{
                    selectedEvent.startdate.toLocaleTimeString("fr-CH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}</span>

                  <span
                    v-if="
                      selectedEvent.hasEndDateDifferent ||
                        selectedEvent.hasEndDateTime
                    "
                  >
                    -
                  </span>
                  <span v-if="selectedEvent.hasEndDateDifferent">{{
                    selectedEvent.enddate.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })
                  }}
                  </span>

                  <span v-if="selectedEvent.hasEndDateTime">{{
                    selectedEvent.enddate.toLocaleTimeString("fr-CH", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <a :href="selectedEvent.link">
              <v-img
                :src="selectedEvent.image_src || selectedEvent.image"
                alt=""
              />
            </a>
            <v-card-title>
              <a :href="selectedEvent.link">{{ selectedEvent.summary }}</a>
            </v-card-title>
            <v-card-text class="black--text links">
              <div v-html="selectedEvent.description" />
            </v-card-text>
            <v-card-actions>
              <v-chip
                v-for="tag in selectedEvent.tags"
                :key="tag"
                class="tag"
              >
                {{ tag }}
              </v-chip>
              <v-spacer />
              <v-btn
                v-if="selectedEvent.link"
                color="primary"
                target="_blank"
                :href="selectedEvent.link"
              >
                Info
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </ClientOnly>
    </v-container>
  </Layout>
</template>

<script>
import { spaceLogoThumb } from "@/utils/fallback";

const API_ENDPOINT = "https://fablab.ch/";

import SpaceFilter from "@/components/SpaceFilter.vue";

export default {
  metaInfo: {
    title: "Events",
  },
  components: {
    SpaceFilter,
  },
  data() {
    return {
      events: [],
      focus: "",
      calendarId: 0,
      selectedOpen: false,
      selectedEvent: undefined,
      selectedElement: undefined,
      filteredSpaces: {},
    };
  },
  methods: {
    spaceLogoThumb,
    setToday() {
      this.focus = "";
    },
    async onFilteredSpaces(filteredSpaces) {
      this.filteredSpaces = filteredSpaces;
      this.calendarId++;
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() =>
          setTimeout(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(() => setTimeout(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    // TODO add filters
    async updateRange({ start, end }) {
      this.events = await fetch(
        `${API_ENDPOINT}api/events?startdate__gte=${
          start.date
        }T00:00:00&startdate__lte=${end.date}T23:59:59` +
          Object.keys(this.filteredSpaces).reduce((filter, slug) => {
            if (this.filteredSpaces[slug]) {
              filter += `&space__slug=${slug}`;
            }
            return filter;
          }, ""),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(async (res) => {
        if (res.status === 200) {
          const data = await res.json();
          return data.map((e) => {
            e.startdate = new Date(e.startdate);
            e.enddate = new Date(e.enddate);
            e.timed = true;
            e.hasStartDateTime = !(
              e.startdate.getHours() === 0 && e.startdate.getMinutes() === 0
            );

            //enddate
            // if not same date hasEndDateDifferent
            e.hasEndDateDifferent = !(
              e.enddate.getDate() === e.startdate.getDate() &&
              e.enddate.getMonth() === e.startdate.getMonth() &&
              e.enddate.getYear() === e.startdate.getYear()
            );
            e.hasEndDateTime = !(
              e.enddate.getHours() === 0 && e.enddate.getMinutes() === 0
            );
            //grab first link
            if (e.description) {
              var match = e.description.match(
                /(?:https?:\/\/|www\.)+(?![^\s]*?")([\w.,@?!^=%&amp;:/~+#-]*[\w@?!^=%&amp;/~+#-])?/i
              );
              if (match) {
                e.link = match[0];
              }
            }

            const tags = e.description.match(/#[a-z]+/gi) || [];
            e.tags = [];
            tags.forEach(function(tag) {
              if (e.tags.indexOf(tag) === -1) {
                e.tags.push(tag);
              }
            });
            e.tags.sort();

            return e;
          });
        }
        return [];
      });
    },
  },
};
</script>
