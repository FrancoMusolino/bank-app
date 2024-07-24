import type { Config } from 'jest';

const config: Config = {
  // NESTJS DEFAULT
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{!(module|guard),}.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',

  // ADDED CONFIG
  verbose: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

export default config;
