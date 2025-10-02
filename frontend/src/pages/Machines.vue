<template>
  <v-container>
    <section>
      <h2 id="capabilities" class="text-h4 my-3">Capabilities</h2>
      <v-table fixed-header height="60vh" density="compact">
        <thead>
          <tr>
            <th>FabLab</th>
            <th v-for="key in filteredMachineTypes" :key="key">
              {{ machineTypes[key] }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="space in spacesWithCapabilities" :key="space.id">
            <td class="links">
              <div class="d-flex align-center">
                <v-btn
                  :to="`/space/${space.id}`"
                  icon
                  class="mr-3"
                  :title="space.name"
                >
                  <v-avatar size="32">
                    <img :src="spaceLogoThumb(space)" />
                  </v-avatar>
                </v-btn>
                <router-link
                  :to="`/space/${space.id}`"
                  class="text-truncate d-inline-block"
                  style="max-width: 150px"
                  :title="space.name"
                >
                  {{ space.name }}
                </router-link>
              </div>
            </td>
            <td
              v-for="key in filteredMachineTypes"
              :key="key"
              :class="{ 'text-grey': space.noinfo }"
            >
              {{
                (space.noinfo && '???') ||
                (space.capabilities[key].length && 'Yes') ||
                'No'
              }}
              <span
                v-if="
                  space.capabilities[key].filter((e) => typeof e === 'string')
                    .length > 0
                "
              >
                ({{
                  space.capabilities[key]
                    .filter((e) => typeof e === 'string')
                    .join(', ')
                }})
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
      <small>* Based on machines listed on this page</small>
    </section>

    <v-btn fab fixed bottom right small to="/machines#machines">
      <v-icon>mdi-arrow-up-bold</v-icon>
    </v-btn>

    <h2 id="machines" class="text-h4 mt-16">Machines</h2>
    <v-chip-group @update:model-value="(val) => $router.push(`/machines/#${val}`)">
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
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { loadData } from '@/utils/dataLoader'
import machineTypes from '@/data/machine_types.yml'
import { spaceLogoThumb } from '@/utils/fallback'
import MachineList from '@/components/MachineList.vue'

export default {
  name: 'MachinesPage',
  components: { MachineList },
  setup() {
    const spaces = ref([])
    const machines = ref([])
    const spaceMachines = ref([])

    const filteredMachineTypes = computed(() => {
      return Object.keys(machineTypes).filter(
        (a) => a !== 'missing' && a !== 'other'
      )
    })

    const spacesWithCapabilities = computed(() => {
      return spaces.value.map((space) => {
        const capabilities = Object.keys(machineTypes).reduce(
          (caps, key) => {
            caps[key] = []
            return caps
          },
          {}
        )

        const spaceMs = spaceMachines.value.filter((sm) => sm.spaceId === space.id)
        
        if (spaceMs.length === 0) {
          space.noinfo = true
        } else {
          space.noinfo = false
        }

        spaceMs.forEach((sm) => {
          const machine = machines.value.find((m) => m.id === sm.ref)
          if (machine) {
            if (!capabilities[machine.type]) {
              capabilities[machine.type] = []
            }
            capabilities[machine.type].push(sm.power || true)
          }
        })

        return {
          ...space,
          capabilities,
        }
      })
    })

    const groupedMachines = computed(() => {
      const grouped = Object.keys(machineTypes).reduce(
        (groupedMachines, key) => {
          groupedMachines[key] = []
          return groupedMachines
        },
        {}
      )

      machines.value.forEach((machine) => {
        const machineSpaces = spaceMachines.value
          .filter((sm) => sm.ref === machine.id)
          .map((sm) => {
            const space = spaces.value.find((s) => s.id === sm.spaceId)
            return space
          })
          .filter(Boolean)

        const enrichedMachine = {
          ...machine,
          spaces: machineSpaces,
        }

        grouped[machine.type].push(enrichedMachine)
      })

      return grouped
    })

    onMounted(async () => {
      const data = await loadData()
      spaces.value = data.spaces.sort((a, b) => a.id.localeCompare(b.id))
      machines.value = data.machines.sort((a, b) => a.name.localeCompare(b.name))
      spaceMachines.value = data.spaceMachines
    })

    return {
      spaces,
      machines,
      spaceMachines,
      spacesWithCapabilities,
      groupedMachines,
      machineTypes,
      filteredMachineTypes,
      spaceLogoThumb,
    }
  },
}
</script>

<style scoped>
.links a {
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
</style>

