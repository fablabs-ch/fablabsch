<template>
  <Layout>
    <v-container>
      <section>
        <h2 id="capabilities" class="text-h4 my-3">
          Capabilities
        </h2>
        <v-simple-table fixed-header height="60vh" dense>
          <thead>
            <tr>
              <th>FabLab</th>
              <th v-for="key in filterdMachineTypes" :key="key">
                {{ machineTypes[key] }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="space in spaces" :key="space.id">
              <td class="links">
                <div class="d-flex align-center">
                  <v-btn
                    :to="`/space/${space.id}`"
                    icon
                    tile
                    class="mr-3"
                    :title="space.name"
                  >
                    <v-avatar size="32" tile>
                      <img :src="spaceLogoThumb(space)" />
                    </v-avatar>
                  </v-btn>
                  <g-link
                    :to="`/space/${space.id}`"
                    class="text-truncate d-inline-block"
                    style="max-width:150px"
                    :title="space.name"
                  >
                    {{ space.name }}
                  </g-link>
                </div>
              </td>
              <td
                v-for="key in filterdMachineTypes"
                :key="key"
                :class="{ 'grey--text': space.noinfo }"
              >
                {{
                  (space.noinfo && "???") ||
                    (space.capabilties[key].length && "Yes") ||
                    "No"
                }}
                <span
                  v-if="
                    space.capabilties[key].filter((e) => typeof e === 'string')
                      .length > 0
                  "
                >
                  ({{
                    space.capabilties[key]
                      .filter((e) => typeof e === "string")
                      .join(", ")
                  }})
                </span>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <small>* Based on machines listed on this page</small>
      </section>
      <v-btn fab fixed bottom right small to="/machines#machines">
        <v-icon>mdi-arrow-up-bold</v-icon>
      </v-btn>
      <h2 id="machines" class="text-h4 mt-16">
        Machines
      </h2>
      <v-chip-group @change="$router.push(`/machines/#${$event}`)">
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
  </Layout>
</template>

<script>
import machineTypes from "@/data/machine_types.yml";
import { spaceLogoThumb } from "@/utils/fallback";
import MachineList from "@/components/MachineList.vue";

export default {
  components: { MachineList },
  metaInfo: {
    title: "Machines",
  },
  data() {
    return {
      spaces: [],
      groupedMachines: {},
      machineTypes,
    };
  },
  computed: {
    filterdMachineTypes() {
      return Object.keys(this.machineTypes).filter(
        (a) => a !== "missing" && a !== "other"
      );
    },
  },
  mounted() {
    this.computeCapabilities();
    this.groupMachines();
  },
  methods: {
    spaceLogoThumb,
    computeCapabilities() {
      this.spaces = this.$page.allSpace.edges.map(({ node }) => {
        const space = node;
        space.capabilties = Object.keys(machineTypes).reduce(
          (capabilties, key) => {
            capabilties[key] = [];
            return capabilties;
          },
          {}
        );
        if (space.machines.length === 0) {
          space.noinfo = true;
        }
        space.machines.forEach((spaceMachine) => {
          if (
            !Object.prototype.hasOwnProperty.call(
              space.capabilties,
              spaceMachine.ref.type
            )
          ) {
            space.capabilties[spaceMachine.ref.type] = [];
          }
          space.capabilties[spaceMachine.ref.type].push(
            spaceMachine.power || true
          );
        });
        return space;
      });
    },
    groupMachines() {
      const groupedMachines = Object.keys(machineTypes).reduce(
        (groupedMachines, key) => {
          groupedMachines[key] = [];
          return groupedMachines;
        },
        {}
      );
      this.$page.allMachine.edges.forEach(({ node }) => {
        node.spaces = node.belongsTo.edges.map(({ node }) => node.space);
        groupedMachines[node.type].push(node);
      });

      this.groupedMachines = groupedMachines;
    },
  },
};
</script>
<style>
.links a {
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
.no-spaces {
  border-color: red !important;
}
</style>

<page-query>
query {
  allSpace(sortBy: "id", order: ASC) {
    edges {
      node {
        id
        name
        fileInfo {
          fallback
        }
        machines {
          ref {
            type
          }
          power
        }
      }
    }
  }
  allMachine(sortBy: "name", order: ASC) {
    edges {
      node {
        id
        name
        fileInfo {
          subfolder
          fallback
        }
        vendor {
          id
        }
        type
        work_size
        belongsTo {
          edges {
            node {
              ... on SpaceMachine {
                space {
                  id
                  name
                  fileInfo {
                    fallback
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</page-query>
