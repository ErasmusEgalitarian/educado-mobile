import jest from "jest-mock";

export const Camera = {
  Type: {
    front: "front",
    back: "back",
  },
  Constants: {
    Type: { front: "front", back: "back" },
  },
  requestPermissionsAsync: jest.fn(),
  getAvailableCameraTypesAsync: jest.fn(),
};
