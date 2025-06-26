const fs = require('fs');
const path = require('path');

// Mock dependencies
jest.mock('fs');
jest.mock('replace-in-file', () => jest.fn().mockResolvedValue([]));

const mockSpinner = {
    start: jest.fn(() => mockSpinner),
    succeed: jest.fn(() => mockSpinner),
    fail: jest.fn(() => mockSpinner),
};

// Mock the dynamic import for ora
const originalImport = global.import;
global.import = jest.fn().mockImplementation((module) => {
    if (module === 'ora') {
        return Promise.resolve({
            default: jest.fn(() => mockSpinner),
        });
    }
    return originalImport ? originalImport(module) : Promise.reject(new Error(`Module ${module} not mocked`));
});

// Mock child_process exec
const mockExec = jest.fn();
jest.mock('node:util', () => ({
    promisify: jest.fn(() => mockExec),
}));

const mockDegitInstance = {
    on: jest.fn(),
    clone: jest.fn().mockResolvedValue(),
};

const mockDegit = jest.fn(() => mockDegitInstance);
jest.mock('degit', () => mockDegit);

// Mock the package.json
jest.mock(
    '../../package.json',
    () => ({
        blueprints: {
            'react-app': 'gavant/react-app-blueprint',
        },
    }),
    { virtual: true }
);

// Import the function under test
const runBlueprint = require('../../blueprints/react-app');

describe('React App Blueprint', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Reset mocks
        mockExec.mockResolvedValue({ stdout: '', stderr: '' });
        mockDegitInstance.clone.mockResolvedValue();
        mockDegitInstance.on.mockImplementation(() => {});

        // Mock fs.existsSync to return false by default (directory doesn't exist)
        fs.existsSync.mockReturnValue(false);

        // Mock process.cwd
        jest.spyOn(process, 'cwd').mockReturnValue('/test/cwd');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should be a function that can be called', () => {
        expect(typeof runBlueprint).toBe('function');
    });

    test('should complete without throwing when called with valid parameters', async () => {
        // Spy on console to suppress output
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        // This is an integration test - we just want to make sure it doesn't throw
        await expect(runBlueprint('test-app')).resolves.not.toThrow();

        consoleSpy.mockRestore();
    });

    test('should handle skipYarn option', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        // This should not throw and should complete
        await expect(runBlueprint('test-app', { skipYarn: true })).resolves.not.toThrow();

        consoleSpy.mockRestore();
    });

    test('should handle skipGit option', async () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        // This should not throw and should complete
        await expect(runBlueprint('test-app', { skipGit: true })).resolves.not.toThrow();

        consoleSpy.mockRestore();
    });
});
