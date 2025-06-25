// Global test setup
global.console = {
    ...console,
    // Mock console.log to avoid clutter in test output unless explicitly needed
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
};
