/**
 * This file contains the test suite for the SectionCard component.
 * It imports React, render, fireEvent and renderer from testing-library/react-native.
 * It also imports the SectionCard component from the components/section directory.
 * The useNavigation hook is mocked using jest.mock.
 * A sample section object is created for testing purposes.
 * The test suite includes tests for rendering the component with provided data,
 * displaying the correct status based on progress, and expanding and collapsing the component.
 * @module SectionCard.test
 */

import { render, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import SectionCard from "../../../components/Section/SectionCard";
import { mockDataAsyncStorage } from "../../mockData/mockDataAsyncStorage";

// Mock the useNavigation hook outside the describe block
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

let sectionCard;

// Sample section data for testing
const mockData = mockDataAsyncStorage();

beforeEach(async () => {
  sectionCard = renderer.create(<SectionCard section={mockData.section} />);
});

afterAll(() => {
  jest.resetModules();
  jest.restoreAllMocks();
});

describe("<SectionCard />", () => {
  it("Renders correctly with provided data", async () => {
    const { getByText } = render(<SectionCard section={mockData.section} />);

    // Check if title and description are displayed
    expect(getByText(mockData.section.title)).toBeTruthy();
  });

  /*it('Displays correct status based on progress', async () => {
    const { queryByText } = render(<SectionCard section={mockData.section} />);

    // Use a regular expression to match the 0/total pattern
    const pattern = new RegExp(`0/${mockData.section.total}`);
    expect(queryByText(pattern)).toBeTruthy();
  });*/
  /**
   * Tests if the SectionCard component renders correctly.
   */
  it("renders SectionCard correctly", async () => {
    expect(await sectionCard.toJSON()).toMatchSnapshot();
  });

  it("should trigger onPress when the card is pressed", () => {
    // Mock data for testing
    const mockData = {
      section: {
        title: "Sample Section",
        components: ["Component 1", "Component 2", "Component 3"],
      },
      progress: 1, // Example progress value
    };

    // Mock the onPress function
    const mockOnPress = jest.fn();

    // Render the SectionCard component
    const { getByText } = render(
      <SectionCard
        section={mockData.section}
        progress={mockData.progress}
        onPress={mockOnPress}
      />,
    );

    // Locate the TouchableOpacity by the section title text
    const touchableElement = getByText(mockData.section.title);

    // Simulate a press event
    fireEvent.press(touchableElement);

    // Assert that the onPress function was called
    expect(mockOnPress).toHaveBeenCalled();
  });
});
