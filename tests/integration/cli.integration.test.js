const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdtemp = promisify(fs.mkdtemp);
// Use fs.rm for Node.js 14+ or fallback to fs.rmdir for older versions
const rmdir = promisify(fs.rm || fs.rmdir);

describe('CLI Integration Tests', () => {
    let tempDir;

    beforeEach(async () => {
        // Create a temporary directory for each test
        tempDir = await mkdtemp(path.join(require('os').tmpdir(), 'gavin-cli-test-'));
    });

    afterEach(async () => {
        // Clean up temporary directory
        if (tempDir && fs.existsSync(tempDir)) {
            await rmdir(tempDir, { recursive: true, force: true });
        }
    });

    test('should display help when no command provided', (done) => {
        const child = spawn('node', [path.join(__dirname, '../../bin/index.js')], {
            cwd: tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            // Should exit with error code when no command provided
            expect(code).not.toBe(0);
            expect(stderr).toContain('Not enough non-option arguments');
            done();
        });
    }, 10000);

    test('should display help with --help flag', (done) => {
        const child = spawn('node', [path.join(__dirname, '../../bin/index.js'), '--help'], {
            cwd: tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.on('close', (code) => {
            expect(code).toBe(0);
            expect(stdout).toContain("Hi, I'm Gavin!");
            expect(stdout).toContain('Usage: gavin [command] [options]');
            expect(stdout).toContain('Create a new React application');
            done();
        });
    }, 10000);

    test('should show version with --version flag', (done) => {
        const child = spawn('node', [path.join(__dirname, '../../bin/index.js'), '--version'], {
            cwd: tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.on('close', (code) => {
            expect(code).toBe(0);
            expect(stdout.trim()).toBe('0.0.3'); // Should match package.json version
            done();
        });
    }, 10000);

    test.skip('should handle invalid command gracefully', (done) => {
        const child = spawn('node', [path.join(__dirname, '../../bin/index.js'), 'invalid-command'], {
            cwd: tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            expect(code).not.toBe(0);
            // yargs shows help and the unknown command in stdout, not stderr
            expect(stdout).toContain('Unknown command');
            done();
        });
    }, 15000);

    test('should require app-name for create react-app command', (done) => {
        const child = spawn('node', [path.join(__dirname, '../../bin/index.js'), 'create', 'react-app'], {
            cwd: tempDir,
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stderr = '';

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            expect(code).not.toBe(0);
            expect(stderr).toContain('Missing required argument');
            done();
        });
    }, 10000);

    // Note: We're not testing the full create react-app functionality here
    // as it requires network access and would create actual files.
    // That's better tested in the unit tests with mocks.
});
