import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { Animated } from "react-native";

Animated.timing = () => ({
  start: () => jest.fn(),
});

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native-alert-notification", () => {
  return {
    AlertNotificationRoot: jest
      .fn()
      .mockImplementation(({ children }) => children),
  };
});
