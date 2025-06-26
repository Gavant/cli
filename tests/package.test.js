const pkg = require('../package.json');

describe('Package.json Validation', () => {
    test('should have all required fields', () => {
        expect(pkg.name).toBe('@gavant/cli');
        expect(pkg.version).toBeDefined();
        expect(pkg.description).toBeDefined();
        expect(pkg.author).toBeDefined();
        expect(pkg.main).toBe('./bin/index.js');
    });

    test('should have correct bin configuration', () => {
        expect(pkg.bin).toBeDefined();
        expect(pkg.bin.gavin).toBe('./bin/index.js');
    });

    test('should have all required dependencies', () => {
        const requiredDeps = ['chalk', 'cli-spinners', 'degit', 'ora', 'replace-in-file', 'yargs'];

        requiredDeps.forEach((dep) => {
            expect(pkg.dependencies[dep]).toBeDefined();
        });
    });

    test('should have test script configured', () => {
        expect(pkg.scripts.test).toBe('jest');
        expect(pkg.scripts['test:watch']).toBe('jest --watch');
        expect(pkg.scripts['test:coverage']).toBe('jest --coverage');
    });

    test('should have blueprints configuration', () => {
        expect(pkg.blueprints).toBeDefined();
        expect(pkg.blueprints['react-app']).toBe('gavant/react-app-blueprint');
    });

    test('should have jest configuration', () => {
        expect(pkg.jest).toBeDefined();
        expect(pkg.jest.testEnvironment).toBe('node');
        expect(pkg.jest.collectCoverageFrom).toContain('bin/**/*.js');
        expect(pkg.jest.collectCoverageFrom).toContain('blueprints/**/*.js');
        expect(pkg.jest.collectCoverageFrom).toContain('utils/**/*.js');
    });

    test('should have volta configuration for node version', () => {
        expect(pkg.volta).toBeDefined();
        expect(pkg.volta.node).toBeDefined();
        expect(pkg.volta.yarn).toBeDefined();

        // Ensure node version is parseable
        const nodeVersion = pkg.volta.node.split('.')[0];
        expect(parseInt(nodeVersion)).toBeGreaterThanOrEqual(18);
    });
});
