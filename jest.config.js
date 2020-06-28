module.exports = {
    roots: ['<rootDir>/test'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         functions: 80,
    //         lines: 80,
    //         statements: 80
    //     }
    // },
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    globals: {
        'ts-jest': {
          tsConfig: 'tsconfig-test.json'
        }
      },
      testPathIgnorePatterns: ["<rootDir>/util/"]
  }