import * as api from '../../api/api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StorageService from '../../services/StorageService.js';
import { mockDataAPI } from '../mockData/mockDataAPI.js';
import { mockDataAsyncStorage } from '../mockData/mockDataAsyncStorage.js';
import * as userApi from "../../api/userApi";


jest.mock('@react-native-async-storage/async-storage');

// Mock the API functions
jest.mock('../../api/api');
jest.mock("../../api/userApi");

const mockData = mockDataAPI();
const mockDataAsync = mockDataAsyncStorage();


describe('StorageService Functions', () => {
  // Helper function to reset mocked AsyncStorage
  const resetAsyncStorage = () => {
    AsyncStorage.clear();
    AsyncStorage.getItem.mockReset();
    AsyncStorage.setItem.mockReset();
    AsyncStorage.removeItem.mockReset();
  };

  beforeEach(() => {
    resetAsyncStorage();
  });

  describe('getUserInfo', () => {
    it('should get user info from AsyncStorage', async () => {
      // Arrange
      const mockUserInfo = { name: 'John Doe', email: 'john@example.com' };
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUserInfo));

      // Act
      const result = await StorageService.getUserInfo();

      // Assert
      expect(result).toEqual(mockUserInfo);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@userInfo');
    });

    it('should throw an error if AsyncStorage.getItem fails', async () => {
      // Arrange
      AsyncStorage.getItem.mockRejectedValueOnce(new Error('AsyncStorage error'));

      // Act and Assert
      await expect(StorageService.getUserInfo()).rejects.toThrow('AsyncStorage error');
    });

    it('should throw an error if JSON parsing fails', async () => {
      // Arrange
      AsyncStorage.getItem.mockResolvedValueOnce('Invalid JSON data');

      // Act and Assert
      await expect(StorageService.getUserInfo()).rejects.toThrowError();
    });
  });



  /** COURSES */

  describe('Course List', () => {
    // Test cases for getCourseList
    it('should return the course list from AsyncStorage if it exists', async () => {

      // Arrange
      AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDataAsync.allCourses));
      jest.spyOn(api, 'getCourses').mockResolvedValueOnce(mockData.allCoursesData);

      // Act
      const result = await StorageService.getCourseList();

      // Assert
      expect(result).toEqual(mockDataAsync.allCourses);

      // Clean up by restoring the original api.getCourses function
      jest.restoreAllMocks();
    });

    it('should call refreshCourseList if course list', async () => {

      // Arrange
      jest.spyOn(api, 'getCourses').mockResolvedValueOnce(mockData.allCoursesData);

      // Act
      const result = await StorageService.getCourseList();

      // Assert
      expect(result).toEqual(mockDataAsync.allCourses);

      // Clean up by restoring the original api.getCourses function
      jest.restoreAllMocks();

    });

    it('should handle errors in refreshCourseList', async () => {

      const errorMessage = "Error getting course list from database: " + mockData.errorResponse;

      // Mock AsyncStorage to simulate an error


      // Mocking the refreshCourseList function from StorageServices
      jest.spyOn(api, 'getCourses').mockRejectedValue(new Error(errorMessage));


        const result = await StorageService.getCourseList();

        expect(result).toStrictEqual([]);
      //Clean up by restoring the original StorageService.refreshCourseList function
      jest.restoreAllMocks();
    });

  });

  /** SECTIONS **/

  describe('getSectionList', () => {
    it('should get the section list from API and refresh it in AsyncStorage', async () => {
      // Arrange
      const mockSectionList = [{ title: 'Section 1' }, { title: 'Section 2' }];
      jest.spyOn(api, 'getAllSections').mockResolvedValueOnce(mockSectionList);
      jest.spyOn(StorageService, 'refreshSectionList').mockImplementationOnce((list) => list);

      // Act
      const result = await StorageService.getSectionList('course_id');

      // Assert
      expect(result).toEqual(mockSectionList);
      expect(await api.getAllSections).toHaveBeenCalledWith('course_id');
    });

    it('should use locally stored sections if API fails and local data exists', async () => {
      // Arrange
      const mockSectionList = [{ title: 'Section 1' }, { title: 'Section 2' }];
      jest.spyOn(api, 'getAllSections').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockSectionList));

      // Act
      const result = await StorageService.getSectionList('course_id');

      // Assert
      expect(result).toEqual(mockSectionList);
    });

    it('should return an empty array if both API and local storage fail', async () => {
      // Arrange
      jest.spyOn(api, 'getAllSections').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockRejectedValueOnce(new Error('AsyncStorage error'));
      const result = await StorageService.getSectionList('course_id');
      // Act and Assert
      await expect(result).toEqual([]);
    });

    it('should return an empty array if locally stored data is corrupted', async () => {
      // Arrange
      jest.spyOn(api, 'getAllSections').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockResolvedValueOnce('Invalid JSON data');
      const result = await StorageService.getSectionList('course_id');
      // Act and Assert
      await expect(result).toEqual([]);
    });
    jest.restoreAllMocks();
  });

  /** LECTURES **/


  describe('getComponentList', () => {
    it('should get component list from API', async () => {
      // Arrange
      const mockSectionID = 'section_id';
      const mockComponentList = [{ title: 'Lecture 1' }, { title: 'Lecture 2' }];
      jest.spyOn(api, 'getComponents').mockResolvedValueOnce(mockComponentList);

      // Act
      const result = await StorageService.getComponentList(mockSectionID);

      // Assert
      expect(result).toEqual(mockComponentList);
      expect(api.getComponents).toHaveBeenCalledWith(mockSectionID);
    });

    it('should use locally stored components if API fails and local data exists', async () => {
      // Arrange
      const mockSectionID = 'section_id';
      const mockComponentList = [{ title: 'Lecture 1' }, { title: 'Lecture 2' }];
      jest.spyOn(api, 'getComponents').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockComponentList));

      // Act
      const result = await StorageService.getComponentList(mockSectionID);

      // Assert
      expect(result).toEqual(mockComponentList);
      expect(api.getComponents).toHaveBeenCalledWith(mockSectionID);
    });

    it('should return an empty array if both API and local storage fail', async () => {
      // Arrange
      const mockSectionID = 'section_id';
      jest.spyOn(api, 'getComponents').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockRejectedValueOnce(new Error('AsyncStorage error'));

      // Act
      const result = await StorageService.getComponentList(mockSectionID);

      // Assert
      expect(result).toEqual([]);
      expect(api.getComponents).toHaveBeenCalledWith(mockSectionID);
    });

    it('should return an empty array if locally stored data is corrupted', async () => {
      // Arrange
      const mockSectionID = 'section_id';
      jest.spyOn(api, 'getComponents').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockResolvedValueOnce('Invalid JSON data');

      // Act
      const result = await StorageService.getComponentList(mockSectionID);

      // Assert
      expect(result).toEqual([]);
      expect(api.getComponents).toHaveBeenCalledWith(mockSectionID);
    });
  });


  describe('fetchLectureImage', () => {
    it('should fetch lecture image from API and return it', async () => {
      // Arrange
      const mockImageID = 'image_id';
      const mockLectureID = 'lecture_id';
      const mockImage = { url: 'https://example.com/image.jpg' };
      jest.spyOn(api, 'getBucketImage').mockResolvedValueOnce(mockImage);

      // Act
      const result = await StorageService.fetchLectureImage(mockImageID, mockLectureID);

      // Assert
      expect(result).toEqual(mockImage);
      expect(api.getBucketImage).toHaveBeenCalledWith(mockImageID);
    });

    it('should use locally stored image if API fails and local data exists', async () => {
      // Arrange
      const mockImageID = 'image_id';
      const mockLectureID = 'lecture_id';
      const mockImage = { url: 'https://example.com/image.jpg' };
      jest.spyOn(api, 'getBucketImage').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockImage));

      // Act
      const result = await StorageService.fetchLectureImage(mockImageID, mockLectureID);

      // Assert
      expect(result).toEqual(mockImage);
      expect(api.getBucketImage).toHaveBeenCalledWith(mockImageID);
    });

    it('should return null if both API and local storage fail', async () => {
      // Arrange
      const mockImageID = 'image_id';
      const mockLectureID = 'lecture_id';
      jest.spyOn(api, 'getBucketImage').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockRejectedValueOnce(new Error('AsyncStorage error'));

      // Act
      const result = await StorageService.fetchLectureImage(mockImageID, mockLectureID);

      // Assert
      expect(result).toBeNull();
      expect(api.getBucketImage).toHaveBeenCalledWith(mockImageID);
    });

    it('should return null if locally stored data is corrupted', async () => {
      // Arrange
      const mockImageID = 'image_id';
      const mockLectureID = 'lecture_id';
      jest.spyOn(api, 'getBucketImage').mockRejectedValueOnce(new Error('API error'));
      await AsyncStorage.getItem.mockResolvedValueOnce('Invalid JSON data');

      // Act
      const result = await StorageService.fetchLectureImage(mockImageID, mockLectureID);

      // Assert
      expect(result).toBeNull();
      expect(api.getBucketImage).toHaveBeenCalledWith(mockImageID);
    });
    jest.restoreAllMocks();
  });

  /** SUBSCRIPTION **/

  describe('Subscribed Course List', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear all mocked function calls before each test
    });

    // Test cases for getSubCourseList
    it('should return the subscribed course list from AsyncStorage if it exists', async () => {
      // Mock AsyncStorage behavior
      AsyncStorage.getItem.mockResolvedValue(mockData.userData._id);
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDataAsync.subscribedCourses2));

      // Mock the api.getSubscriptions function
      jest.spyOn(api, 'getSubscriptions').mockResolvedValue(mockData.subscribedCourses2);

      const result = await StorageService.getSubCourseList();

      expect(result).toEqual(mockDataAsync.subscribedCourses2);
    });

    it('should call refreshSubCourseList and return its result if courses are not in AsyncStorage', async () => {
      // Mock AsyncStorage behavior
      AsyncStorage.getItem
          .mockResolvedValueOnce(mockData.userData._id)
          .mockResolvedValueOnce(null); // Mock the user ID and course list as not found

      // Mock the refreshSubCourseList function
      jest.spyOn(StorageService, 'refreshSubCourseList').mockResolvedValue(mockDataAsync.subscribedCourses);

      // Mock the api.getSubscriptions function
      jest.spyOn(api, 'getSubscriptions').mockResolvedValue(mockData.subscribedCourses);

      const result = await StorageService.getSubCourseList();
      expect(result).toEqual(mockDataAsync.subscribedCourses);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@subCourseList',
          JSON.stringify(mockDataAsync.subscribedCourses)
      );
    });

    it('should throw an error if AsyncStorage getItem fails', async () => {
      // Mock AsyncStorage to simulate a failure
      AsyncStorage.getItem.mockRejectedValue(new Error('Cannot fetch user id from async storage'));

      await expect(StorageService.getSubCourseList()).rejects.toThrow('Cannot fetch user id from async storage');
    });
  });

  describe('subscribe', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should subscribe the user to a course', async () => {
      // Mock AsyncStorage.getItem to return a user ID
      AsyncStorage.getItem.mockResolvedValue(mockData.userData._id);

      // Mock the successful behavior of api.subscribeToCourse
      await api.subscribeToCourse.mockResolvedValue('Subscription Successful');
      await userApi.addCourseToStudent.mockResolvedValue({hello: "Hello"});


      // Call the subscribe function
      const result = await StorageService.subscribe(mockData.courseData._id);

      // Assert that the result is as expected
      //expect(result).toBe('Subscription Successful');

      // Assert that AsyncStorage.getItem was called with the correct arguments
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@userId');

      // Assert that api.subscribeToCourse was called with the correct arguments
      expect(api.subscribeToCourse).toHaveBeenCalledWith(mockData.userData._id, mockData.courseData._id);

    });

    it('should throw an error when AsyncStorage getItem fails', async () => {
      // Mock AsyncStorage.getItem to simulate a failure
      AsyncStorage.getItem.mockRejectedValue(new Error('Cannot fetch user id from async storage'));

      // Assert that the subscribe function throws the expected error
      await expect(StorageService.subscribe(mockData.courseData._id)).rejects.toThrow('Cannot fetch user id from async storage');

      // Assert that AsyncStorage.getItem was called with the correct arguments
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@userId');
    });

    it('should throw an error when api.subscribeToCourse fails', async () => {
      // Mock AsyncStorage.getItem to return a user ID
      AsyncStorage.getItem.mockResolvedValue(mockData.userData._id);

      // Mock the behavior of api.subscribeToCourse to simulate a failure
      api.subscribeToCourse.mockRejectedValue(new Error('API error in subscribe:'));

      // Assert that the subscribe function throws the expected error
      await expect(StorageService.subscribe(mockData.courseData._id)).rejects.toThrow('API error in subscribe:');

      // Assert that AsyncStorage.getItem was called with the correct arguments
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@userId');

      // Assert that api.subscribeToCourse was called with the correct arguments
      expect(api.subscribeToCourse).toHaveBeenCalledWith(mockData.userData._id, mockData.courseData._id);
    });
  });

  describe('unsubscribe', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should unsubscribe the user to a course', async () => {
      // Mock AsyncStorage.getItem to return a user ID
      AsyncStorage.getItem.mockResolvedValue(mockData.userData._id);

      // Mock the successful behavior of api.subscribeToCourse
      await api.unSubscribeToCourse.mockResolvedValue('Unsubscription Successful');

      // Call the subscribe function
      const result = await StorageService.unsubscribe(mockData.courseData._id);

      // Assert that the result is as expected
      expect(result).toBe('Unsubscription Successful');

      // Assert that AsyncStorage.getItem was called with the correct arguments
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@userId');

      // Assert that api.subscribeToCourse was called with the correct arguments
      expect(api.unSubscribeToCourse).toHaveBeenCalledWith(mockData.userData._id, mockData.courseData._id);
    });

    it('should throw an error when AsyncStorage getItem fails', async () => {
      // Mock AsyncStorage.getItem to simulate a failure
      AsyncStorage.getItem.mockRejectedValue(new Error('Cannot fetch user id from async storage'));

      // Assert that the subscribe function throws the expected error
      await expect(StorageService.unsubscribe(mockData.courseData._id)).rejects.toThrow('Cannot fetch user id from async storage');

      // Assert that AsyncStorage.getItem was called with the correct arguments
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@userId');
    });

    it('should throw an error when api.subscribeToCourse fails', async () => {
      // Mock AsyncStorage.getItem to return a user ID
      AsyncStorage.getItem.mockResolvedValue(mockData.userData._id);

      // Mock the behavior of api.subscribeToCourse to simulate a failure
      api.unSubscribeToCourse.mockRejectedValue(new Error('Unsubscription failed'));

      // Assert that the subscribe function throws the expected error
      await expect(StorageService.unsubscribe(mockData.courseData._id)).rejects.toThrow('Unsubscription failed');

      // Assert that AsyncStorage.getItem was called with the correct arguments
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@userId');

      // Assert that api.subscribeToCourse was called with the correct arguments
      expect(api.unSubscribeToCourse).toHaveBeenCalledWith(mockData.userData._id, mockData.courseData._id);
    });
  });


  /** Downloading course **/
  
/*
  describe('storeCourseLocally', () => {
    it('should store course locally and update AsyncStorage', async () => {
      // Arrange
      const mockCourseID = 'course_id';
      const mockCourse = {title: 'Course 1', _id: 'course_id', dateUpdated: '2023-01-01'};
      const mockSectionList = [{title: 'Section 1', _id: 'section_id'}];
      const mockLectureList = [{title: 'Lecture 1', _id: 'lecture_id', image: 'image_id'}];
      const mockImage = {image: 'image_id'};
      const mockExerciseList = [{title: 'Exercise 1', _id: 'exercise_id'}];
 

      jest.spyOn(api, 'getCourse').mockResolvedValueOnce(mockCourse);
      jest.spyOn(api, 'getAllSections').mockResolvedValueOnce(mockSectionList);
      jest.spyOn(api, 'getLecturesInSection').mockResolvedValueOnce(mockLectureList);
      jest.spyOn(api, 'getBucketImage').mockResolvedValueOnce(mockImage);
      jest.spyOn(api, 'getExercisesInSection').mockResolvedValueOnce(mockExerciseList);
      jest.spyOn(StorageService, 'deleteLocallyStoredCourse').mockImplementationOnce(() => {
      });
      await AsyncStorage.setItem.mockImplementationOnce(() => {
      });

      // Act
      const result = await StorageService.storeCourseLocally(mockCourseID);

      // Assert
      expect(result).toBe(true);
      expect(api.getCourse).toHaveBeenCalledWith(mockCourseID);
      expect(api.getAllSections).toHaveBeenCalledWith(mockCourseID);
      expect(api.getLecturesInSection).toHaveBeenCalledWith('section_id');
      expect(api.getBucketImage).toHaveBeenCalledWith('image_id');
      expect(api.getExercisesInSection).toHaveBeenCalledWith('section_id');
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(5); // Check the actual count based on your calls
    });

    it('should handle errors and return false', async () => {
      // Arrange
      const mockCourseID = 'course_id';

      // Mock API responses to simulate an error
      jest.spyOn(api, 'getCourse').mockRejectedValueOnce(new Error('API error'));

      // Act
      const result = await StorageService.storeCourseLocally(mockCourseID);

      // Assert
      expect(result).toBe(false);
      expect(api.getCourse).toHaveBeenCalledWith(mockCourseID);
      // Add more assertions based on the specific error-handling logic in your implementation
    });

  });

*/


  describe('deleteLocallyStoredCourse', () => {

    it('should delete a locally stored course and return true', async () => {
      // Arrange
      const mockCourseID = 'course_id';
      const mockSectionList = [{_id: 'section_id_1', lectures: [{_id: 'lecture_id_1'}] }, {_id: 'section_id_2', lectures: [{_id: 'lecture_id_2'}] }];
      const mockLectureList1 = [{_id: 'lecture_id_1'}];
      const mockLectureList2 = [{_id: 'lecture_id_2'}];
      const USER_ID = '@userId';

      // Mock AsyncStorage getItem and removeItem

      //jest.spyOn(AsyncStorage, 'getItem').mockImplementationOnce(
      //AsyncStorage.getItem = jest.fn(
      await AsyncStorage.getItem.mockImplementation(
          async (key) => {
        if (key === '@userId'){
          return 'userID';
        } else if (key === ('S' + 'course_id')) {
          return JSON.stringify(mockSectionList);
        } else if (key === ('L' + mockSectionList[0]._id)) {
          return JSON.stringify(mockLectureList1);
        } else if (key === ('L' + mockSectionList[1]._id)) {
          return JSON.stringify(mockLectureList2);
        }
      });

      //await AsyncStorage.getItem('@userId').mockResolvedValueOnce('userID');

      await AsyncStorage.removeItem.mockResolvedValue();

      // Act
      const result = await StorageService.deleteLocallyStoredCourse(mockCourseID);
/*
      // Assert
      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(USER_ID);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('S' + mockCourseID);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('L' + mockSectionList[0]._id);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('L' + mockSectionList[1]._id);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(mockCourseID + await AsyncStorage.getItem(USER_ID));
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('S' + mockCourseID);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('L' + mockSectionList[0]._id);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('E' + mockSectionList[0]._id);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('I' + mockLectureList1[0]._id);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('L' + mockSectionList[1]._id);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('E' + mockSectionList[1]._id);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('I' + mockLectureList2[0]._id);
*/
      // Add more assertions based on your actual implementation
    });

    it('should handle errors and return false', async () => {
      // Arrange
      const mockCourseID = 'course_id';
      const USER_ID = '@userId';

      // Mock AsyncStorage getItem to simulate an error
      await AsyncStorage.getItem.mockRejectedValue(new Error('AsyncStorage error'));

      // Act
      const result = await StorageService.deleteLocallyStoredCourse(mockCourseID);

      // Assert
      expect(result).toBe(false);
      expect(await AsyncStorage.getItem).toHaveBeenCalledWith(USER_ID);
      // Add more assertions based on your actual error-handling logic
    });
  });

  describe('updateStoredCourses', () => {

    it('should update locally stored courses based on subscriptions', async () => {
      // Arrange
      const mockSubList = [
        { courseId: 'course_id_1', dateUpdated: '2023-01-01' },
        { courseId: 'course_id_2', dateUpdated: '2023-01-02' },
      ];
      const USER_ID = '@userId';
      const mockCourseID = 'course_id';

      //StorageService.getSubCourseList = jest.fn().mockResolvedValue(mockSubList);

      //jest.spyOn(StorageService, 'getSubCourseList').mockResolvedValue(mockSubList);
      jest.spyOn(StorageService, 'storeCourseLocally').mockResolvedValue(true);

      //await StorageService.getSubCourseList.mockImplementation(async ()=> {
      // return mockSubList;
      // });

      // Mock AsyncStorage getItem and setItem
      await AsyncStorage.getItem.mockImplementation(async (key) => {
        if (key === USER_ID) {
          return 'user_id';
        } else if (key === (mockSubList[0].courseId + 'user_id')) {
          return JSON.stringify(mockSubList[0]);
        } else if ( key === (mockSubList[1].courseId + 'user_id')) {
          return JSON.stringify(mockSubList[1]);
        }
        return null;
      });

      // Act
      await StorageService.updateStoredCourses();

      // Assert
      expect(await AsyncStorage.getItem).toHaveBeenCalledWith(USER_ID);
      expect(await StorageService.storeCourseLocally).toBeCalledTimes(0);
      // Add more assertions based on your actual implementation
    });

    it('should handle errors during course update', async () => {
      // Arrange
      const mockSubList = [{ courseId: 'course_id_1', dateUpdated: '2023-01-01' }];
      const USER_ID = '@userId';

      // Mock AsyncStorage getItem and setItem
      AsyncStorage.getItem.mockImplementation(async (key) => {
        if (key === USER_ID) {
          return 'user_id'; // Mock logged-in user ID
        }
        return null;
      });
      AsyncStorage.setItem.mockResolvedValue(true);

      // Mock API functions
      jest.spyOn(StorageService, 'storeCourseLocally').mockResolvedValue(new Error('API error'));

      // Act
      await StorageService.updateStoredCourses();

      // Assert
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(USER_ID);
      expect(api.getSubscriptions).toHaveBeenCalledWith('user_id');
      // Add more assertions based on your actual error-handling logic
    });
  });

});
