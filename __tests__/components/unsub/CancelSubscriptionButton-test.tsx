/**
 * This file contains the unit tests for the CancelSubscriptionButton component.
 * The component is tested for rendering and onPress function call.
 * @module CancelSubscriptionButtonTest
 */
import renderer from "react-test-renderer";
import SubscriptionCancelButton from "../../../components/Section/CancelSubscriptionButton";

/**
 * Describes the test suite for the SubscriptionCancel component.
 */
describe("<SubscriptionCancel />", () => {
  let pressed = false;

  /**
   * Mock function to set pressed to true when called.
   */
  const mockOnPress = () => {
    pressed = true;
  };

  let subscriptionCancel;

  /**
   * Resets modules and restores all mocks after all tests have run.
   */
  afterAll(async () => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  /**
   * Resets pressed to false and creates a new instance of SubscriptionCancel before each test.
   */
  beforeEach(async () => {
    pressed = false;
    subscriptionCancel = renderer.create(
      <SubscriptionCancelButton onPress={mockOnPress} />,
    );
  });

  /**
   * Tests if the onPress function is called when the SubscriptionCancel button is pressed.
   */
  it("Pressing SubscriptionCancel button calls onPress function", async () => {
    const subscriptionCancelButton = await subscriptionCancel.root.findByProps({
      testID: "subscriptionCancelButton",
    });
    await renderer.act(() => {
      return subscriptionCancelButton.props.onPress();
    });
    expect(pressed).toBe(true);
  });
});
