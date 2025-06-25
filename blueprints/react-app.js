const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const degit = require('degit');
const replace = require('replace-in-file');
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

const pkg = require('../package.json');

const APP_NAME_TOKEN = /{{APP_NAME}}/g;
const APP_WORKSPACE = 'app';
const DEFAULT_GIT_TAG = 'HEAD';

async function runCommand(cmd, { loadingMsg, successMsg, failureMsg }) {
    const ora = (await import('ora')).default;
    const spinner = ora({ text: loadingMsg });

    try {
        spinner.start();
        await cmd();
        spinner.succeed(chalk.green(successMsg));
    } catch (err) {
        spinner.fail(chalk.red(`${failureMsg} ${err.message ? `(${err.message})` : ''}`));
        throw err;
    }
}

async function cloneRepo(appName, options) {
    const dir = path.join(process.cwd(), appName);
    const repo = `${pkg.blueprints['react-app']}#${options.gitTag || DEFAULT_GIT_TAG}`;

    return runCommand(
        async () => {
            if (fs.existsSync(dir)) {
                throw new Error('target directory already exists');
            }

            const emitter = degit(repo, {
                cache: false,
                force: true,
                verbose: true,
            });

            emitter.on('info', (info) => {
                if (options.verbose) {
                    console.info(info.message);
                }
            });

            await emitter.clone(dir);
        },
        {
            loadingMsg: 'Cloning blueprint repo...',
            successMsg: 'Blueprint cloned!',
            failureMsg: 'Unable to clone blueprint!',
        }
    );
}

async function replaceTokens(appName, options) {
    const dir = path.join(process.cwd(), appName);

    return runCommand(
        async () => {
            return replace({
                files: `${dir}/**/*`,
                ignore: ['node_modules', '.yarn', '.git'],
                from: APP_NAME_TOKEN,
                to: appName,
                glob: {
                    dot: true,
                },
            });
        },
        {
            loadingMsg: 'Setting app name...',
            successMsg: 'App name set!',
            failureMsg: 'Unable to set app name!',
        }
    );
}

async function installDependencies(appName, options) {
    if (options.skipYarn) {
        return;
    }

    const rootDir = path.join(process.cwd(), appName);
    const appDir = path.join(rootDir, APP_WORKSPACE);

    return runCommand(
        async () => {
            // Increase maxBuffer to handle large yarn output
            const execOptions = { maxBuffer: 1024 * 1024 * 10 }; // 10MB buffer
            await exec(`cd ${rootDir} && yarn install`, execOptions);
            await exec(`cd ${appDir} && yarn install`, execOptions);
        },
        {
            loadingMsg: 'Installing dependencies, this could take awhile...',
            successMsg: 'Installed dependencies!',
            failureMsg: 'Unable to install dependencies!',
        }
    );
}

async function initGitRepo(appName, options) {
    if (options.skipGit) {
        return;
    }

    const dir = path.join(process.cwd(), appName);

    return runCommand(
        async () => {
            await exec(`cd ${dir} && git init`);
        },
        {
            loadingMsg: 'Initializing git repository...',
            successMsg: 'Initialized git repository!',
            failureMsg: 'Unable to initialize git repository!',
        }
    );
}

async function runBlueprint(appName, options = {}) {
    try {
        await cloneRepo(appName, options);
        await replaceTokens(appName, options);
        await installDependencies(appName, options);
        await initGitRepo(appName, options);
        console.log(chalk.green(`🍻 Your brand spankin' new React app is ready!`));
    } catch (err) {
        console.log(chalk.red('🙁 Sorry, there was a problem creating the React app.'));
        if (options.verbose) {
            console.error(err);
        }
    }
}

module.exports = runBlueprint;
