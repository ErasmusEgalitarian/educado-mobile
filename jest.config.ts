import type { Config } from "jest";

const config: Config = {
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
  testMatch: [
    "<rootDir>/__tests__/screens/section/SectionScreen-test.tsx",
    "<rootDir>/__tests__/services/NetworkStatusService-test.tsx",
    "<rootDir>/__tests__/components/exercise/ExerciseInfo-test.tsx",
    "<rootDir>/__tests__/components/login/FormTextField-test.tsx",
    "<rootDir>/__tests__/components/exercise/Progressbar-test.tsx",
    "<rootDir>/__tests__/components/login/FormFieldAlert-test.tsx",
    "<rootDir>/__tests__/components/login/FormButton-test.tsx",
    "<rootDir>/__tests__/api/api-test.ts",
  ],
};

export default config;
