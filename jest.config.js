
module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tool/',
  ],
  moduleFileExtensions: [ 'js', 'mjs', 'cjs', 'ts', 'jsx', 'tsx' ],
  testMatch: [
    '**/?(*.)+(spec|test).(m)[jt]s?(x)',
  ],
  transform: {
    '\\.m?[tj]sx?$': 'babel-jest',
  },
};
