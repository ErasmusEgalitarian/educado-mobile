import renderer, { act } from "react-test-renderer";
import ExerciseInfo from "../../../components/Exercise/ExerciseInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

let navigated = false;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(() => {
      navigated = true;
    }),
  }),
  useRoute: () => ({
    params: {}, // Add any route parameters your component relies on
  }),
}));

let ExerciseInfoScreen;

beforeEach(() => {
  navigated = false;
  AsyncStorage.clear();
  // Provide required props so the component renders deterministically
  act(() => {
    ExerciseInfoScreen = renderer.create(
      <ExerciseInfo courseTitle="My Course" sectionTitle="Section 1" />,
    );
  });
});

afterEach(() => {
  try {
    if (ExerciseInfoScreen && ExerciseInfoScreen.unmount) {
      ExerciseInfoScreen.unmount();
    }
  } catch (e) {
    // ignore
  }
});

describe("ExerciseInfo", () => {
  it("renders ExerciseInfo correctly", () => {
    expect(ExerciseInfoScreen.toJSON()).toMatchSnapshot();
  });
});
