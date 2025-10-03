// Data loading utilities
let cachedData = null

export async function loadData() {
  if (cachedData) {
    return cachedData
  }

  const [spaces, machines, spaceMachines, vendors] = await Promise.all([
    fetch('/data/spaces.json').then((r) => r.json()),
    fetch('/data/machines.json').then((r) => r.json()),
    fetch('/data/spaceMachines.json').then((r) => r.json()),
    fetch('/data/vendors.json').then((r) => r.json()),
  ])

  cachedData = {
    spaces,
    machines,
    spaceMachines,
    vendors,
  }

  return cachedData
}

export function getSpaceById(id) {
  return cachedData?.spaces.find((s) => s.id === id)
}

export function getMachineById(id) {
  return cachedData?.machines.find((m) => m.id === id)
}

export function getSpaceMachines(spaceId) {
  if (!cachedData) return []
  return cachedData.spaceMachines
    .filter((sm) => sm.spaceId === spaceId)
    .map((sm) => ({
      ...sm,
      machine: getMachineById(sm.ref),
    }))
}
