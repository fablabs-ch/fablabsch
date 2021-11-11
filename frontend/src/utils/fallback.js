export function spaceLogo(space) {
  if (space.fileInfo.fallback) {
    return '/img/fallback/space.png';
  }
  return `/img/spaces/${space.id}.webp`;
}

export function spaceLogoThumb(space) {
  if (space.fileInfo.fallback) {
    return '/img/fallback/space_thumb.png';
  }
  return `/img/spaces/${space.id}_thumb.webp`
}

export function machineLogo(machine) {
  if (machine.fileInfo.fallback) {
    return '/img/fallback/machine.png';
  }
  return `/img/${machine.fileInfo.subfolder}/${machine.id}.webp`
}

export function machineLogoThumb(machine) {
  if (machine.fileInfo.fallback) {
    return '/img/fallback/machine_thumb.png';
  }
  return `/img/${machine.fileInfo.subfolder}/${machine.id}_thumb.webp`
}
