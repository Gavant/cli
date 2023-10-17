#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const runReactAppBlueprint = require('../blueprints/react-app');

const usage = chalk.cyan(`\nHi, I'm Gavin! 👋\nUsage: gavin [command] [options]`);

// TODO: Would be nice to have a bundler handle syncing the volta version with this one
const nodeMajor = 18;

const checkNodeVersion = () => {
    if (parseInt(process.version.split('.')?.[0]?.replace('v', '')) < nodeMajor) {
        console.log(chalk.redBright('Command failed'))
        console.log(chalk.redBright(`Gavin formally requests you upgrade to Node ${nodeMajor}+`))
        process.exit(1)
    }
}

yargs(hideBin(process.argv))
    .usage(usage)
    .middleware(checkNodeVersion)
    .command(
        'create react-app [app-name]',
        'Create a new React application',
        (yargs) => {
            return yargs
                .positional('app-name', {
                    describe: 'The internal name of the application',
                })
                .demandOption(['app-name']);
        },
        (argv) =>
            runReactAppBlueprint(argv['app-name'], {
                skipYarn: argv['skip-yarn'],
                skipGit: argv['skip-git'],
                gitTag: argv['git-tag'],
                verbose: argv.verbose,
            })
    )
    .option('skip-yarn', {
        type: 'boolean',
        description: "Don't install yarn dependencies",
    })
    .option('skip-git', {
        type: 'boolean',
        description: "Don't initialize a new git repository",
    })
    .option('git-tag', {
        type: 'string',
        description: 'A tag, branch, or commit to use when cloning the blueprint repo',
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging',
    })
    .demandCommand()
    .parse();
