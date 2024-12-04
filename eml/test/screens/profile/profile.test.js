import React from "react";
import renderer from 'react-test-renderer';
import ProfileComponent from "../../../screens/profile/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";

let navigated = false;

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(() => { navigated = true }),
  }),
  useFocusEffect: jest.fn(),
}))

describe('Profile screen', () => {

  let profileScreen;

  beforeEach(() => {
    navigated = false;
    AsyncStorage.clear();
    profileScreen = renderer.create(<ProfileComponent />);
  });

  it('Pressing edit profile, navigates to the edit profile page', async () => {
    const editProfileNav = profileScreen.root.findByProps({ testId: "editProfileNav" });
    await renderer.act(() => {
      editProfileNav.props.onPress();
    });
    expect(navigated).toBe(true);
  });
});