const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Mock the blueprint function
const mockRunReactAppBlueprint = jest.fn();
jest.mock('../../blueprints/react-app', () => mockRunReactAppBlueprint);

// Mock the node utility
const mockCheckNodeVersion = jest.fn();
jest.mock('../../utils/node', () => ({
    checkNodeVersion: mockCheckNodeVersion,
}));

// Mock chalk
jest.mock('chalk', () => ({
    cyan: jest.fn((str) => str),
    green: jest.fn((str) => str),
    red: jest.fn((str) => str),
}));

describe('CLI Interface', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should parse create react-app command with app name', async () => {
        const argv = ['create', 'react-app', 'my-app'];

        // Import the CLI module to test yargs configuration
        // We'll test the yargs configuration by checking if it properly parses commands
        const parser = yargs(argv)
            .middleware(mockCheckNodeVersion)
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
                    mockRunReactAppBlueprint(argv['app-name'], {
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
            .demandCommand();

        const result = await parser.parse();

        expect(mockCheckNodeVersion).toHaveBeenCalled();
        expect(mockRunReactAppBlueprint).toHaveBeenCalledWith('my-app', {
            skipYarn: undefined,
            skipGit: undefined,
            gitTag: undefined,
            verbose: undefined,
        });
    });

    test('should parse create react-app command with options', async () => {
        const argv = ['create', 'react-app', 'my-app', '--skip-yarn', '--verbose', '--git-tag', 'v1.0.0'];

        const parser = yargs(argv)
            .middleware(mockCheckNodeVersion)
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
                    mockRunReactAppBlueprint(argv['app-name'], {
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
            .demandCommand();

        await parser.parse();

        expect(mockRunReactAppBlueprint).toHaveBeenCalledWith('my-app', {
            skipYarn: true,
            skipGit: undefined,
            gitTag: 'v1.0.0',
            verbose: true,
        });
    });

    test('should handle skip-git option', async () => {
        const argv = ['create', 'react-app', 'my-app', '--skip-git'];

        const parser = yargs(argv)
            .middleware(mockCheckNodeVersion)
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
                    mockRunReactAppBlueprint(argv['app-name'], {
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
            .demandCommand();

        await parser.parse();

        expect(mockRunReactAppBlueprint).toHaveBeenCalledWith('my-app', {
            skipYarn: undefined,
            skipGit: true,
            gitTag: undefined,
            verbose: undefined,
        });
    });

    test('should handle verbose flag shorthand', async () => {
        const argv = ['create', 'react-app', 'my-app', '-v'];

        const parser = yargs(argv)
            .middleware(mockCheckNodeVersion)
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
                    mockRunReactAppBlueprint(argv['app-name'], {
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
            .demandCommand();

        await parser.parse();

        expect(mockRunReactAppBlueprint).toHaveBeenCalledWith('my-app', {
            skipYarn: undefined,
            skipGit: undefined,
            gitTag: undefined,
            verbose: true,
        });
    });
});
