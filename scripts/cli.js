#!/usr/bin/env node

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
  const shortName = name.replace("@instructure/", "");

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
  const packageList = await readdir(installDir);
  if (packageList.includes(name) || packageList.includes(shortName)) {
    console.error(
      chalk.redBright(
        `There is already a package named "${name}". Choose a different name.`,
      ),
    );

    process.exit(1);
  }

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
  const i18n = await readFile(`${installDir}/${shortName}/src/i18n.js`, "utf8");
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
      `/*
* Copyright (C) 2020 - present Instructure, Inc.
*
* This file is part of Canvas.
*
* Canvas is free software: you can redistribute it and/or modify it under
* the terms of the GNU Affero General Public License as published by the Free
* Software Foundation, version 3 of the License.
*
* Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
* WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
* A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
* details.
*
* You should have received a copy of the GNU Affero General Public License along
* with this program. If not, see <http://www.gnu.org/licenses/>.
*/
     
      import {render} from '${name}';

const domNode = document.getElementById('root');
    
render(domNode);
`,
    );
  }

  if (!forced) {
    console.log(chalk.cyanBright(`Running Yarn...`));

    execSync(`yarn`, {
      stdio: [0, 1, 2], // we need this so node will print the command output
      cwd: installDir, // path to where you want to save the file
    });
  }

  // Print instructions for how to wire up the rest
  console.log(
    chalk.cyanBright(
      "Be sure to check out the readme to know how to use this package and integrate it with Canvas.\n",
    ),
  );

  console.log(chalk.greenBright("Installed successfully! Good luck!"));
}

execute();
