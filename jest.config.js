module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    'app/javascript/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'lcov',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  reporters: [
    'default',
    ['./node_modules/jest-html-reporter', {
      outputPath: './test/html_reports/jest-report.html',
      pageTitle: 'Test Report',
    }],
  ],
  setupFiles: [
    // 'jest-prop-type-error',
    'regenerator-runtime/runtime',
  ],
  setupFilesAfterEnv: [
    './test/javascript/setupTests.js',
  ],
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.(js)x?$': './test/javascript/transform.js',
  },
  transformIgnorePatterns: ['/node_modules/(?!(lodash-es|@juggle/resize-observer)/)'],
};
