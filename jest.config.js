'use strict';

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '.coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/'
  ],
  coverageProvider: 'v8',
  coverageReporters: [
    'lcov'
  ],
  setupFilesAfterEnv: [
    'jest-extended'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/test/**/*.spec.ts'
  ],
  testTimeout: 30000,
  verbose: false
};
