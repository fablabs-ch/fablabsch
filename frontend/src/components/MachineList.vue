<template>
  <section>
    <template v-for="(group, key) in groupedMachines" :key="key">
      <div v-if="group.length > 0">
        <h3 :id="key" class="text-h5 mt-16 mb-6">
          {{ machineTypes[key] }}
        </h3>
        <v-row>
          <v-col
            v-for="machine in group"
            :key="machine.id"
            class="col-12 col-sm-6 col-md-4 pa-2"
          >
            <v-card
              :id="machineId(machine.id)"
              class="fill-height d-flex flex-column machine"
            >
              <v-card-title>{{ machine.name }}</v-card-title>
              <v-card-subtitle>{{ machine.vendor }}</v-card-subtitle>
              <v-img :src="machineLogo(machine)" :alt="machine.name" />
              <v-card-text>
                <ul class="text-none pa-0">
                  <li v-if="machine.qty">
                    <b>Quantity:</b> {{ machine.qty }}
                  </li>
                  <li v-if="machine.work_size">
                    <b>Work size:</b> {{ machine.work_size }}
                  </li>
                  <li v-if="machine.power">
                    <b>Power:</b> {{ machine.power }}
                  </li>
                </ul>
              </v-card-text>
              <v-card-text v-if="machine.spaces">
                <div
                  class="text-subtitle-2 py-2"
                  :class="{ 'text-error': machine.spaces.length === 0 }"
                >
                  Available at:
                </div>
                <v-tooltip
                  v-for="space in machine.spaces"
                  :key="space.id"
                  location="bottom"
                >
                  <template #activator="{ props }">
                    <v-btn
                      :to="`/space/${space.id}`"
                      icon
                      v-bind="props"
                      class="mx-1"
                    >
                      <v-avatar size="40">
                        <img :src="spaceLogoThumb(space)" />
                      </v-avatar>
                    </v-btn>
                  </template>
                  <span>{{ space.name }}</span>
                </v-tooltip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
  </section>
</template>

<script>
import machineTypes from '@/data/machine_types.yml'
import machineId from '@/utils/machineId'
import { spaceLogoThumb, machineLogo } from '@/utils/fallback'

export default {
  name: 'MachineList',
  props: {
    groupedMachines: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      machineTypes,
      spaceLogoThumb,
      machineLogo,
      machineId,
    }
  },
}
</script>

<style scoped>
.machine ul {
  list-style-type: none;
}
</style>

