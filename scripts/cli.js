const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const {promisify} = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const {execSync} = require("child_process");

// Make sure we get the required name argument (and prefix it with "@instructure" if necessary)
async function execute() {
  let name = process.argv[2];

  if (!name) {
    console.error(
      chalk.redBright(
        '"name" is a required parameter. Please include a name as an argument.',
      ),
    );

    process.exit(1);
  }
  if (!name.includes("@instructure/")) {
    name = `@instructure/${name}`;
  }
  console.log(chalk.cyanBright(`Creating a new package: ${name}`));
  // Check to see if we are anywhere close to a Canvas installation
  // Traverse the file system as far as we can go
  // Skip if we have a "--force" argument
  let installDir = path.resolve("./");
  let forced = true;
  async function checkForPackageJson(dir) {
    if (dir === "/") return false;
    try {
      if (
        JSON.parse(await readFile(`${path.resolve(dir)}/package.json`)).name ===
        "canvas-lms"
      ) {
        return path.resolve(`${dir}/packages`);
      }
    } catch (e) {
      // do nothing
    }
    return checkForPackageJson(path.resolve(dir, ".."));
  }
  if (!process.argv.includes("--force")) {
    forced = false;
    installDir = await checkForPackageJson("./");
    if (!installDir) {
      console.error(
        chalk.redBright(
          'This script must be run inside the Canvas code directory. To override this behavior, pass the "--force" flag to the command.',
        ),
      );

      process.exit(1);
    }
  }

  console.log(chalk.cyanBright(`Attempting to install in ${installDir}`));

  // Make sure the name isn't taken
  // Loop through all of the packages and make sure none exactly match the name
  if (await (await readdir(installDir)).includes(name)) {
    console.error(
      chalk.redBright(
        `There is already a package named "${name}". Choose a different name.`,
      ),
    );

    process.exit(1);
  }

  const shortName = name.replace("@instructure/", "");

  console.log(chalk.cyanBright("Cloning git repository..."));
  // Clone the canvas-app repository
  execSync(
    `git clone --depth 1 https://github.com/instructure/canvas-app.git ${shortName}`,
    {
      stdio: [0, 1, 2], // we need this so node will print the command output
      cwd: installDir, // path to where you want to save the file
    },
  );

  console.log(chalk.cyanBright("Updating package.json..."));

  // Update the package.json and other references to `canvas-app`
  const package = JSON.parse(
    await readFile(`${installDir}/${shortName}/package.json`, "utf8"),
  );
  package.name = name;
  await writeFile(
    `${installDir}/${shortName}/package.json`,
    JSON.stringify(package, null, 2),
  );

  console.log(chalk.cyanBright("Updating i18n references..."));
  const i18n = await readFile(`${installDir}/${shortName}/src/i18n.js`);
  await writeFile(
    `${installDir}/${shortName}/src/i18n.js`,
    i18n.replace(/\/canvas-app\//gi, `/${shortName}/`),
  );

  console.log(
    chalk.cyanBright(
      `Creating ${path.resolve(
        `${installDir}/../app/jsx/bundles/${shortName}.js`,
      )}`,
    ),
  );
  // Add a file to the app/jsx/bundles directory
  if (!forced) {
    await writeFile(
      path.resolve(`${installDir}/../app/jsx/bundles/${shortName}.js`),
      `import {render} from '${name}';

const domNode = document.getElementById('root');
    
render(domNode);
`,
    );
  }

  // Print instructions for how to wire up the rest
  console.log(chalk.greenBright("Installed successfully! Good luck!"));
}

execute();
