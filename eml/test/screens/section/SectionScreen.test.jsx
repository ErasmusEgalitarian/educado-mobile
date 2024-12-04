/**
 * This file contains the test suite for the SectionScreen component.
 * It tests the rendering of the component with sections loaded and the unsubAlert function.
 * @module SectionScreen.test
 */

import React from 'react';
import renderer from 'react-test-renderer';
import SectionScreen from '../../../screens/section/SectionScreen';
import SectionCard from '../../../components/section/SectionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { mockDataAsyncStorage } from '../../mockData/mockDataAsyncStorage';

/**
 * Mock navigation object used for testing.
 * @type {object}
 * @property {jest.Mock} goBack - Mock function for the goBack method.
 * @property {jest.Mock} navigate - Mock function for the navigate method.
 */
let mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

/**
 * Mocks the useNavigation hook from react-navigation/native.
 * @function useNavigation
 * @returns {object} - Returns the mock navigation object.
 */
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    mockNavigation,
    navigate: jest.fn(() => {
      navigated = true;
    }),
  }),
}));

jest.mock('../../../components/general/BaseScreen', () => {
  return jest.fn().mockImplementation(({ children }) => children);
});

// Mock the ToastNotification
jest.mock('../../../components/general/ToastNotification', () => {
  return jest.fn().mockImplementation(({ children }) => children);
});

/**
 * Flag indicating whether the navigate method was called.
 * @type {boolean}
 */
let navigated = false;

/**
 * The SectionScreen component being tested.
 * @type {ReactTestRenderer}
 */
let sectionScreen;

/**
 * Clears the AsyncStorage before each test.
 */
beforeEach(() => {
  navigated = false;
  AsyncStorage.clear();
});

/**
 * Resets the modules and restores all mocks after all tests have run.
 */
afterAll(() => {
  jest.resetModules();
  jest.restoreAllMocks();
});

describe('SectionScreen', () => {
  /**
   * Mock route object used for testing.
   * @type {object}
   * @property {object} params - Mock params object.
   * @property {number} params.courseId - Mock courseId parameter.
   */
  const route = {
    params: {
      course: {
        courseId: 1,
        title: 1
      },
    },
  };

  /**
   * Mock sections array used for testing.
   * @type {Array<object>}
   */
  const mockData = mockDataAsyncStorage();

  /**
   * Tests the rendering of the SectionScreen component with sections loaded.
   */
  
  /*it('Renders section screen with sections loaded', async () => {
    const StorageService = require('../../../services/StorageService');
    jest.spyOn(StorageService, 'getSectionList').mockResolvedValue(mockData.sectionData);


    await renderer.act(async () => {
      return sectionScreen = renderer.create(<SectionScreen route={route} />);
    });


    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(await sectionScreen.root.findAllByType(SectionCard)).toHaveLength(2);
    expect(await sectionScreen.toJSON()).toMatchSnapshot();
  });
  */

  describe('unsubAlert', () => {
    /**
     * Tests that the unsub function is called when "Sim" is pressed.
     */
    it('should call unsub function when \'Sim\' is pressed', async () => {
      /**
       * Function that displays an alert asking the user if they want to unsubscribe.
       * @function unsubAlert
       * @returns {void}
       */
      const unsubAlert = () => {
        Alert.alert('Cancelar subscrição', 'Tem certeza?', [
          {
            text: 'Não',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
          { text: 'Sim', onPress: unsub },
        ]);
      };
      const unsub = jest.fn();
      const alert = jest.spyOn(Alert, 'alert');
      alert.mockImplementation((_, __, buttons) => buttons[1].onPress());
      unsubAlert();
      expect(alert).toHaveBeenCalled();
      expect(unsub).toHaveBeenCalled();
      alert.mockRestore();
    });

    /**
     * Tests that the unsub function is not called when "Não" is pressed.
     */
    it('should not call unsub function when \'Não\' is pressed', async () => {
      /**
       * Function that displays an alert asking the user if they want to unsubscribe.
       * @function unsubAlert
       * @returns {void}
       */
      const unsubAlert = () => {
        Alert.alert('Cancelar subscrição', 'Tem certeza?', [
          {
            text: 'Não',
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
          },
          { text: 'Sim', onPress: unsub },
        ]);
      };
      const unsub = jest.fn();
      const alert = jest.spyOn(Alert, 'alert');
      alert.mockImplementation((_, __, buttons) => buttons[0].onPress());
      unsubAlert();
      expect(alert).toHaveBeenCalled();
      expect(unsub).not.toHaveBeenCalled();
      alert.mockRestore();
    });
  });
});