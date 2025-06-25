const fs = require('fs');
const path = require('path');

// Mock dependencies
jest.mock('fs');
jest.mock('degit', () => {
    return jest.fn(() => ({
        on: jest.fn(),
        clone: jest.fn().mockResolvedValue(),
    }));
});
jest.mock('replace-in-file', () => jest.fn().mockResolvedValue([]));
jest.mock('ora', () => {
    const mockSpinner = {
        start: jest.fn(() => mockSpinner),
        succeed: jest.fn(() => mockSpinner),
        fail: jest.fn(() => mockSpinner),
    };
    return {
        default: jest.fn(() => mockSpinner),
        __esModule: true,
    };
});

// Mock child_process exec
const mockExec = jest.fn();
jest.mock('node:util', () => ({
    promisify: jest.fn(() => mockExec),
}));

describe('React App Blueprint', () => {
    const runReactAppBlueprint = require('../../blueprints/react-app');

    beforeEach(() => {
        jest.clearAllMocks();

        // Reset mocks
        mockExec.mockResolvedValue({ stdout: '', stderr: '' });

        // Mock fs.existsSync to return false by default (directory doesn't exist)
        fs.existsSync.mockReturnValue(false);

        // Mock process.cwd
        jest.spyOn(process, 'cwd').mockReturnValue('/test/cwd');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should successfully create a React app with default options', async () => {
        mockExec.mockResolvedValue({ stdout: '', stderr: '' });

        await runReactAppBlueprint('test-app');

        // Verify yarn install commands were called with maxBuffer
        expect(mockExec).toHaveBeenCalledWith('cd /test/cwd/test-app && yarn install', { maxBuffer: 1024 * 1024 * 10 });
        expect(mockExec).toHaveBeenCalledWith('cd /test/cwd/test-app/app && yarn install', { maxBuffer: 1024 * 1024 * 10 });

        // Verify git init was called
        expect(mockExec).toHaveBeenCalledWith('cd /test/cwd/test-app && git init');
    });

    test('should skip yarn installation when skipYarn option is true', async () => {
        await runReactAppBlueprint('test-app', { skipYarn: true });

        // Verify yarn install was not called
        expect(mockExec).not.toHaveBeenCalledWith(expect.stringContaining('yarn install'), expect.any(Object));
    });

    test('should skip git initialization when skipGit option is true', async () => {
        mockExec.mockResolvedValue({ stdout: '', stderr: '' });

        await runReactAppBlueprint('test-app', { skipGit: true });

        // Verify git init was not called
        expect(mockExec).not.toHaveBeenCalledWith(expect.stringContaining('git init'));

        // But yarn install should still be called
        expect(mockExec).toHaveBeenCalledWith('cd /test/cwd/test-app && yarn install', { maxBuffer: 1024 * 1024 * 10 });
    });
});
