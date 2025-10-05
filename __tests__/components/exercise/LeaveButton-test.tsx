import renderer from "react-test-renderer";
import LeaveButton from "../../../components/Exercise/LeaveButton";

let navigated = false;

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(() => {
      navigated = true;
    }),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

let leaveButtonScreen;

describe("LeaveButton", () => {
  it("renders correctly", async () => {
    await renderer.act(async () => {
      return (leaveButtonScreen = renderer.create(
        <LeaveButton navigationPlace="examplePlace" courseId={123} />,
      ));
    });

    await new Promise((r) => setTimeout(r, 0));

    expect(leaveButtonScreen.toJSON()).toMatchSnapshot();
  });
});
