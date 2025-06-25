// Mock implementations for testing
const mockSpinner = {
    start: jest.fn(),
    succeed: jest.fn(),
    fail: jest.fn(),
    text: '',
};

const mockOra = jest.fn(() => mockSpinner);

const mockDegitInstance = {
    on: jest.fn(),
    clone: jest.fn(),
};

const mockDegit = jest.fn(() => mockDegitInstance);

const mockReplace = jest.fn();

const mockExec = jest.fn();

module.exports = {
    mockSpinner,
    mockOra,
    mockDegitInstance,
    mockDegit,
    mockReplace,
    mockExec,
};
