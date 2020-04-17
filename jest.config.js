module.exports = {
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.(png|jpg)$': '<rootDir>/__mocks__/mockFile.js',
    '^components(.*)$': '<rootDir>/src/components$1',
    '^config$': '<rootDir>/src/config',
    '^store(.*)$': '<rootDir>/src/store$1',
    '^assets(.*)$': '<rootDir>/src/assets$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',
  },
  // collectCoverageFrom: [
  //   '**/src/**/*.{js,jsx}',
  // ],
};
