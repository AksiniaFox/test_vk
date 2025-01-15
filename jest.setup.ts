import '@testing-library/jest-dom';

global.matchMedia = global.matchMedia || (() => ({
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
