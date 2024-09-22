const config = {
  collectCoverage: false,
  collectCoverageFrom: ['app/javascript/**/*.{js,jsx}', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.js',
  },
  reporters: [
    'default',
    [
      require.resolve('jest-html-reporter'),
      {
        outputPath: './test/html_reports/jest-report.html',
        pageTitle: 'Test Report',
      },
    ],
    [
      require.resolve('jest-junit'),
      {
        outputDirectory: './test/reports',
        outputName: 'TEST-jest.xml',
      },
    ],
  ],
  setupFiles: ['regenerator-runtime/runtime'],
  setupFilesAfterEnv: ['./test/javascript/setupTests.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/config'],
  transform: {
    '^.+\\.(js|ts)x?$': '@swc/jest',
  },
  transformIgnorePatterns: [
    '(node_modules|.yarn/(.cache|__virtual))/(?!(apollo-upload-client|lodash-es|@juggle/resize-observer|react-dnd-multi-backend|@neinteractiveliterature-litform|react-bootstrap4-modal|@apollo/client|ts-invariant|uuid)/)',
  ],
};

module.exports = config;
