module.exports = {
testEnvironment: 'jsdom',
setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
},
moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    "^src/(.*)$": "<rootDir>/src/$1",
},
moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
coverageDirectory: 'coverage',
collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
],
};

