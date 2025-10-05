import renderer from "react-test-renderer";
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
  ExerciseInfoScreen = renderer.create(<ExerciseInfo />);
});

describe("ExerciseInfo", () => {
  it("renders ExerciseInfo correctly", () => {
    expect(ExerciseInfoScreen.toJSON()).toMatchSnapshot();
  });
});
