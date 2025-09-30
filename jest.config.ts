import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  testEnvironment: "node",
  verbose: true,
  transform: {
    "^.+\\.ts?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFiles: ["./jest.setup.ts"],
  transformIgnorePatterns: ["node_modules/?!(@expo-google-fonts|expo_font)"],
  globals: {
    __DEV__: true,
  },
  moduleNameMapper: {
    "expo-font": require.resolve("expo-font"),
    "expo-camera": require.resolve("./__tests__/mockData/mockExpoCamera"),
  },
};

export default config;
