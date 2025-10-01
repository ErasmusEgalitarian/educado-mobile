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
  },
};

module.exports = config;
