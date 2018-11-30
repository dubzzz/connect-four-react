module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json'
    }
  },
  testMatch: ['**/e2e/*.spec.(ts|tsx|js|jsx)'],
  preset: 'ts-jest'
};
