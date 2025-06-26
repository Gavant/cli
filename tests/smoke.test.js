// Basic smoke test to ensure the CLI can be imported without errors
describe('CLI Smoke Tests', () => {
    test('should be able to require main modules without errors', () => {
        expect(() => {
            require('../utils/node');
        }).not.toThrow();

        expect(() => {
            require('../package.json');
        }).not.toThrow();
    });

    test('should validate main module exports', () => {
        const nodeUtils = require('../utils/node');
        expect(nodeUtils.checkNodeVersion).toBeDefined();
        expect(typeof nodeUtils.checkNodeVersion).toBe('function');
    });

    test('should have proper package.json structure', () => {
        const pkg = require('../package.json');
        expect(pkg.name).toBe('@gavant/cli');
        expect(pkg.bin.gavin).toBe('./bin/index.js');
        expect(pkg.dependencies).toBeDefined();
        expect(pkg.dependencies.yargs).toBeDefined();
    });
});
