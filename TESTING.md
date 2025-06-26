# Testing Guide

This document explains how to run and maintain the test suite for the Gavant CLI tool.

## Test Setup

The project uses Jest as the testing framework with the following configuration:

-   **Test Environment**: Node.js
-   **Test Files**: Located in the `tests/` directory
-   **Coverage Collection**: Enabled for `bin/`, `blueprints/`, and `utils/` directories

## Running Tests

### All Tests

```bash
npm test
```

### Tests with Coverage

```bash
npm run test:coverage
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Specific Test Files

```bash
npm test -- --testPathPattern="smoke"
npm test -- --testPathPattern="utils"
```

## Test Categories

### 1. Smoke Tests (`tests/smoke.test.js`)

Basic tests to ensure modules can be imported and core functionality exists.

### 2. Package Validation (`tests/package.test.js`)

Validates that `package.json` has all required fields and proper configuration.

### 3. Utility Tests (`tests/utils/node.test.js`)

Tests the Node.js version checking utility.

### 4. Blueprint Tests (`tests/blueprints/react-app.test.js`)

Tests the React app blueprint functionality with mocked dependencies.

### 5. CLI Interface Tests (`tests/bin/index.test.js`)

Tests the command-line interface argument parsing and command handling.

### 6. Integration Tests (`tests/integration/cli.integration.test.js`)

End-to-end tests that spawn the actual CLI process.

## Test Structure

```
tests/
├── setup.js                    # Global test setup
├── smoke.test.js               # Basic functionality tests
├── package.test.js             # Package.json validation
├── __mocks__/                  # Mock helpers
├── utils/
│   └── node.test.js           # Node version checker tests
├── blueprints/
│   └── react-app.test.js      # Blueprint functionality tests
├── bin/
│   └── index.test.js          # CLI interface tests
└── integration/
    └── cli.integration.test.js # End-to-end tests
```

## Key Testing Features

### Mocking

The tests use extensive mocking to isolate functionality:

-   File system operations
-   Child process execution
-   External dependencies (degit, ora, etc.)
-   Console output

### Coverage

Current coverage targets:

-   **Statements**: ~36%
-   **Branches**: ~29%
-   **Functions**: ~29%
-   **Lines**: ~36%

### Test Utilities

-   Custom mock setup for common dependencies
-   Temporary directory management for integration tests
-   Process mocking for version checking

## Adding New Tests

When adding new functionality:

1. **Unit Tests**: Create tests in the appropriate directory structure
2. **Integration Tests**: Add end-to-end scenarios to integration tests
3. **Mocking**: Use the existing mock patterns for external dependencies
4. **Coverage**: Ensure new code paths are covered

## Test Commands Summary

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm test`              | Run all tests                  |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

## Common Issues

1. **Integration Test Timeouts**: Some integration tests may take longer due to process spawning
2. **Mock Dependencies**: Complex dependencies like `degit` require careful mocking
3. **Process Mocking**: Testing process.exit requires proper setup/teardown

## Coverage Reports

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`. The reports include:

-   HTML report: `coverage/lcov-report/index.html`
-   LCOV format: `coverage/lcov.info`
-   Text summary in console output
