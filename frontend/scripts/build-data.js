import { globby } from 'globby';
import jsYaml from 'js-yaml';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const CONTENT_DIR = '../content';
const OUTPUT_DIR = './public/data';
const OUTPUT_IMG_DIR = './public/img';

function parseYaml(content) {
  const data = jsYaml.load(content);
  return typeof data !== 'object' || Array.isArray(data) ? { data } : data;
}

function findExtension(srcImgFile) {
  const extensions = ['png', 'jpg', 'jpeg'];
  for (const ext of extensions) {
    if (fs.existsSync(`${srcImgFile}.${ext}`)) {
      return `${srcImgFile}.${ext}`;
    }
  }
  return null;
}

async function createImage(node, options) {
  options.postfix = options.postfix || '';
  options.width = options.width || 400;
  let srcImgFile = `${node.fileInfo.directory}/${node.fileInfo.name}`;
  const destDirectory = `${OUTPUT_IMG_DIR}/${node.fileInfo.subfolder}`;
  const destImgFile = `${destDirectory}/${node.fileInfo.name}${options.postfix}.webp`;

  try {
    await fs.promises.mkdir(destDirectory, { recursive: true });
    srcImgFile = findExtension(srcImgFile);

    if (srcImgFile) {
      await sharp(srcImgFile)
        .resize(options.width, options.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1.0 },
        })
        .webp({ nearLossless: true, quality: 90 })
        .toFile(destImgFile);
      node.fileInfo.fallback = false;
    } else {
      console.warn(`Image not found: ${srcImgFile}`);
    }
  } catch (err) {
    console.error(`Error creating image: ${err.message}`);
  }
}

async function createNode(file) {
  const content = await fs.readFile(file, 'utf8');
  const { dir, name, ext } = path.parse(file);
  const data = parseYaml(content);
  data.id = name;
  const directory = dir.split('/');
  directory.shift(); // Remove '.'
  directory.shift(); // Remove 'content'
  data.fileInfo = {
    extension: ext,
    directory: dir,
    subfolder: directory.join('/'),
    path: String(file),
    fallback: true,
    name,
  };
  return data;
}

async function createSpaceNode(file) {
  const node = await createNode(file);
  await createImage(node, {
    width: 40,
    height: 40,
    postfix: '_thumb',
  });
  await createImage(node, {
    width: 160,
    height: 160,
  });
  return node;
}

async function createMachineNode(file) {
  const node = await createNode(file);
  const paths = file.split('/');

  await createImage(node, {
    width: 40,
    height: 40,
    postfix: '_thumb',
  });
  await createImage(node, {
    width: 300,
    height: 200,
  });

  if (paths.length < 6) {
    node.vendor = 'unknown';
    node.type = 'other';
    return node;
  }
  paths.pop();
  const vendor = paths.pop();
  node.vendor = vendor;
  const type = paths.pop();
  node.type = type;
  return node;
}

async function buildData() {
  console.log('Building data from YAML files...');

  // Clean output directories
  await fs.remove(OUTPUT_DIR);
  await fs.remove(OUTPUT_IMG_DIR);
  await fs.ensureDir(OUTPUT_DIR);
  await fs.ensureDir(OUTPUT_IMG_DIR);

  // Load machines
  let machineFiles = await globby(`${CONTENT_DIR}/machines/**/*.yml`);
  machineFiles = machineFiles.filter((file) => !file.split('/').pop().startsWith('_'));
  
  console.log(`Processing ${machineFiles.length} machines...`);
  const machines = await Promise.all(machineFiles.map((file) => createMachineNode(file)));

  const vendors = [...new Set(machines.map((m) => m.vendor))];

  // Load spaces
  let spaceFiles = await globby(`${CONTENT_DIR}/spaces/*.yml`);
  spaceFiles = spaceFiles.filter((file) => !file.split('/').pop().startsWith('_'));
  
  console.log(`Processing ${spaceFiles.length} spaces...`);
  const spacesData = await Promise.all(spaceFiles.map((file) => createSpaceNode(file)));

  // Build space machines relationships
  const spaceMachines = [];
  const spaces = spacesData.map((space) => {
    if (space.machines) {
      space.machines = space.machines.map((m) => {
        let spaceMachine = typeof m === 'string' ? { ref: m } : m;
        spaceMachine.id = randomUUID();
        spaceMachine.spaceId = space.id;
        
        // Find machine or create placeholder
        const machine = machines.find((machine) => machine.id === spaceMachine.ref);
        if (!machine) {
          const missingMachine = {
            id: spaceMachine.ref,
            name: `${spaceMachine.ref} @ ${space.id}`,
            type: 'missing',
            vendor: 'unknown',
            fileInfo: {
              fallback: true,
            },
          };
          machines.push(missingMachine);
          console.warn(`Missing machine: ${spaceMachine.ref} for space ${space.id}`);
        }
        
        spaceMachines.push(spaceMachine);
        return spaceMachine;
      });
    }
    return space;
  });

  // Write data files
  await fs.writeJson(`${OUTPUT_DIR}/machines.json`, machines);
  await fs.writeJson(`${OUTPUT_DIR}/spaces.json`, spaces);
  await fs.writeJson(`${OUTPUT_DIR}/spaceMachines.json`, spaceMachines);
  await fs.writeJson(`${OUTPUT_DIR}/vendors.json`, vendors);

  console.log(`✓ Generated ${machines.length} machines`);
  console.log(`✓ Generated ${spaces.length} spaces`);
  console.log(`✓ Generated ${spaceMachines.length} space-machine relationships`);
  console.log(`✓ Generated ${vendors.length} vendors`);
  console.log('Build complete!');
}

buildData().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
