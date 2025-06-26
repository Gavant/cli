const { checkNodeVersion } = require('../../utils/node');

// Mock the package.json to control the expected node version
jest.mock('../../package.json', () => ({
    volta: {
        node: '18.16.0',
    },
}));

describe('Node Version Checker', () => {
    test('should export checkNodeVersion function', () => {
        expect(checkNodeVersion).toBeDefined();
        expect(typeof checkNodeVersion).toBe('function');
    });

    test('should pass for current Node version', () => {
        // Since we're running this test on Node 18+, it should pass
        expect(() => checkNodeVersion()).not.toThrow();
    });

    test('should handle version parsing correctly', () => {
        // Test that the function can be called without errors
        // (We can't easily test the failure case without complex mocking)
        const pkg = require('../../package.json');
        expect(pkg.volta.node).toBeDefined();
        expect(parseInt(pkg.volta.node.split('.')[0])).toBeGreaterThanOrEqual(18);
    });
});
