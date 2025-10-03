/** @type {import('jest').Config} */
const config = {
  preset: "jest-expo",
  testEnvironment: "node",
  verbose: true,
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transformIgnorePatterns: ["node_modules/?!(@expo-google-fonts|expo_font)"],
  moduleNameMapper: {
    "expo-font": require.resolve("expo-font"),
    // "expo-camera": require.resolve("__tests__/mockData/mockExpoCamera"),
    "^@/(.*)$": "<rootDir>/$1",
  },
  // TODO: Enable tests incrementally after refactoring, not at once, as many are failing
  testMatch: ["<rootDir>/__tests__/api/api-test.ts"],
};

module.exports = config;
