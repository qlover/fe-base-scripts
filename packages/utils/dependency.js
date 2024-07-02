// Do not have any other external dependencies
import { createRequire } from 'module';
import { exec } from 'child_process';
const require = createRequire(import.meta.url);

function execPromise(command, silent = false) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });

    if (silent) {
      // Optional: Log the stdout as it becomes available
      childProcess.stdout.on('data', (data) => {
        console.log(data.toString().trim());
      });

      // Optional: Log the stderr as it becomes available
      childProcess.stderr.on('data', (data) => {
        console.error(data.toString().trim());
      });
    }
  });
}

const shell = { run: execPromise };
const log = console;

async function checkDependencyInstalled(packageName, global = false) {
  const result = { local: false, global: false };
  try {
    // Check locally
    await shell.run(`npm list ${packageName}`);
    result.local = true;
  } catch (localError) {
    try {
      if (global) {
        // If not found locally, check globally
        await shell.run(`npm list -g ${packageName}`);
        result.global = true;
      }
    } catch (globalError) {}
  }

  return result;
}

async function getGlobalDependencyVersion(dependencyName) {
  const result = { version: '', scope: 'global' };
  try {
    const stdioResult = await shell.run(
      `npm ls -g ${dependencyName} --depth=0 --json`
    );
    const jsonResult = JSON.parse(stdioResult);
    if (jsonResult.dependencies && jsonResult.dependencies[dependencyName]) {
      result.version = jsonResult.dependencies[dependencyName].version;
    }
  } catch (error) {
    // Ignore errors, assume dependency is not installed globally
  }
  return result;
}

async function getDependencyVersion(dependencyName) {
  const has = await checkDependencyInstalled(dependencyName, false);
  // Check local dependency
  if (has.local) {
    try {
      const localPackageJsonPath = require.resolve(
        `${dependencyName}/package.json`
      );
      const localPackageJson = require(localPackageJsonPath);
      return { version: localPackageJson.version, scope: 'local' };
    } catch (error) {
      log.error(error);
      // Local package.json not found, continue to global check
    }
  }

  // Check global dependency
  return await getGlobalDependencyVersion(dependencyName);
}

async function checkWithInstall(packageName) {
  const hasDeep = await checkDependencyInstalled(packageName, true);
  if (!(hasDeep.local || hasDeep.global)) {
    log.error(`${packageName} not found, installing ${packageName}`);
    await shell.run(`npm i -g ${packageName}`);
  }
  const version = await getDependencyVersion(packageName);
  log.log(`${packageName} version is: v${version.version}`);
}

async function checkYarn() {
  const hasYarn = await checkDependencyInstalled('yarn', true);
  if (!hasYarn.global) {
    log.warn(`No Yarn found in the global environment, installing yarn`);
    await shell.run('npm i -g yarn');
  }
  const version = await getDependencyVersion('yarn');
  log.log(`Yarn version is: v${version.version}`);
}

export {
  checkDependencyInstalled,
  getGlobalDependencyVersion,
  getDependencyVersion,
  checkWithInstall,
  checkYarn,
  execPromise
};
