// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const jsYaml = require("js-yaml");
const path = require("path");
const fs = require("fs-extra");
const { randomUUID } = require("crypto");
const glob = require("globby");
const sharp = require("sharp");

function parseYaml(content) {
  const data = jsYaml.load(content);
  return typeof data !== "object" || Array.isArray(data) ? { data } : data;
}

async function createImage(node, options) {
  options.postfix = options.postfix || "";
  options.width = options.width || 400;
  const srcImgFile = `${node.fileInfo.directory}/${node.fileInfo.name}.png`;
  const destDirectory = `./static/img/${node.fileInfo.subfolder}`;
  const destImgFile = `${destDirectory}/${node.fileInfo.name}${
    options.postfix
  }.webp`;
  try {
    await fs.promises.mkdir(destDirectory, { recursive: true });
    if (fs.existsSync(srcImgFile)) {
      await sharp(srcImgFile)
        .resize(options.width, options.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1.0 }
        })
        .webp({ nearLossless: true, quality: 90, })
        .toFile(destImgFile);
      node.fileInfo.fallback = false;
    } else {
      console.error(`${srcImgFile} not found`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function createNode(file) {
  const content = await fs.readFile(file, "utf8");
  // filename as slug
  const { dir, name, ext } = path.parse(file);
  const data = parseYaml(content);
  data.id = name;
  const directory = dir.split("/");
  directory.shift();
  directory.shift();
  data.fileInfo = {
    extension: ext,
    directory: dir,
    subfolder: directory.join("/"),
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
    postfix: "_thumb",
  });
  await createImage(node, {
    width: 160,
    height: 160,
  });
  return node;
}

async function createMachineNode(file) {
  const node = await createNode(file);
  const paths = file.split("/");

  await createImage(node, {
    width: 40,
    height: 40,
    postfix: "_thumb",
  });
  await createImage(node, {
    with: 300,
    height: 200,
  });

  if (paths.length < 6) {
    node.vendor = "unknown";
    node.type = "other";
    return node;
  }
  paths.pop();
  const vendor = paths.pop();
  node.vendor = vendor;
  const type = paths.pop();
  node.type = type;
  return node;
}

const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");

module.exports = function(api) {
  api.chainWebpack((config, { isServer }) => {
    config.plugin("vuetify-loader").use(VuetifyLoaderPlugin);
  });

  // clear static folder before build
  fs.rmSync("./static/spaces", { recursive: true, force: true });
  fs.rmSync("./static/machines", { recursive: true, force: true });

  api.loadSource(async ({ addCollection, addSchemaTypes, store }) => {
    // override the default GraphQL schema inferance
    addSchemaTypes(`
      type Space implements Node @infer {
        members: String,
      }
    `);
    addSchemaTypes(`
      type SpaceMachine implements Node @infer {
        power: String,
        qty: Int,
      }
    `);

    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    const spaces = addCollection("Space");
    const machines = addCollection("Machine");
    const spaceMachines = addCollection("SpaceMachine");
    const vendors = addCollection("Vendor");
    spaces.addReference("machines", "SpaceMachine");
    spaceMachines.addReference("ref", "Machine");
    machines.addReference("vendor", "Vendor");

    let files = await glob("../content/machines/**/*.yml");
    files = files.filter(
      (file) =>
        !file
          .split("/")
          .pop()
          .startsWith("_")
    );
    const machinesData = await Promise.all(
      files.map((file) => createMachineNode(file))
    );

    const vendorsData = machinesData.reduce((vendors, machine) => {
      if (!vendors.has(machine.vendor)) {
        vendors.add(machine.vendor);
      }
      return vendors;
    }, new Set(["unknown"]));

    const spaceMachinesData = [];

    files = await glob("../content/spaces/*.yml");
    files = files.filter(
      (file) =>
        !file
          .split("/")
          .pop()
          .startsWith("_")
    );
    const spacesData = await Promise.all(
      files.map(async (file) => {
        const node = await createSpaceNode(file);
        if (node.machines) {
          node.machines = node.machines.map((m) => {
            let spaceMachine = m;
            if (typeof m === "string") {
              spaceMachine = {
                ref: m,
              };
            }
            spaceMachine.id = randomUUID();
            if (!machinesData.find((m) => m.id === spaceMachine.ref)) {
              machinesData.push({
                id: spaceMachine.ref,
                name: `${spaceMachine.ref} @ ${node.id}`,
                type: "missing",
                vendor: "unknown",
                fileInfo: {
                  fallback: true,
                },
              });
            }
            spaceMachine.space = store.createReference('Space', node.id);
            spaceMachinesData.push(spaceMachine);
            return spaceMachine.id;
          });
        }
        return node;
      })
    );
    vendorsData.forEach((vendor) => {
      vendors.addNode({ id: vendor });
    });
    machinesData.forEach((node) => machines.addNode(node));
    spaceMachinesData.forEach((node) => spaceMachines.addNode(node));
    spacesData.forEach((node) => spaces.addNode(node));
  });

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  });
};
