#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');

const runReactAppBlueprint = require('../blueprints/react-app');

const usage = chalk.cyan(`\nHi, I'm Gavin! 👋\nUsage: gavin [command] [options]`);

yargs(hideBin(process.argv))
    .usage(usage)
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
    .help()
    .parse();
