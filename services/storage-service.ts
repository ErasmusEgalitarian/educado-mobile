import * as api from "../api/api";
import * as userApi from "../api/user-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NetworkStatusService } from "./network-status-service";
import defaultImage from "../assets/images/defaultImage-base64.json";
import * as FileSystem from "expo-file-system";
import jwt from "expo-jwt";
import Constants from "expo-constants";

const SUB_COURSE_LIST = "@subCourseList";
const USER_ID = "@userId";
const STUDENT_ID = "@studentId";
const USER_INFO = "@userInfo";
const STUDENT_INFO = "@studentInfo";
const LOGIN_TOKEN = "@loginToken";
const lectureVideoPath = FileSystem.documentDirectory + "lectureVideos/";
let isOnline = true;

/**
 * Updates the network status.
 * @param {boolean} networkStatus - The current network status.
 */
const updateNetworkStatus = (networkStatus) => {
  isOnline = networkStatus;
};

NetworkStatusService.getInstance().addObserver({ update: updateNetworkStatus });

/** LOGIN TOKEN **/

/**
 * Retrieves the login token from AsyncStorage.
 * @returns {Promise<Boolean>} A promise that resolves with the a true or false value.
 */
export const getLoginToken = async () => {
  return await AsyncStorage.getItem(LOGIN_TOKEN);
};

/**
 * Check if login token is valid.
 * @returns {boolean} Returns a boolean indicating whether the token is valid.
 */
export const isLoginTokenValid = async () => {
  const token = await getLoginToken();
  try {
    if (token === null) {
      return false;
    }

    // Access JWT_SECRET
    const jwtSecret = Constants.expoConfig.extra.JWT_SECRET;

    const decodedToken = jwt.decode(token, jwtSecret);

    if (!decodedToken || !decodedToken.exp) {
      // Token or expiration time not available
      return false;
    }

    // Get the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000) + 60 * 60 * 3; // Add 3 hours to make sure session do not expire while in use

    // Check if the expiration time (exp) is in the future
    if (decodedToken.exp > currentTime) {
      return true; // return true if valid time
    }
  } catch (error) {
    console.log(error);
    // An error occurred during decoding or validation
    return false; // Treat as expired
  }
};

/** STUDENT **/
/**
 * Retrieves and stores student information for a given user ID.
 * @param userId - The user ID to retrieve student information for.
 */
export const setStudentInfo = async (userId) => {
  if (isOnline) {
    try {
      const fetchedStudentInfo = await userApi.getStudentInfo(userId);
      if (fetchedStudentInfo.profilePhoto) {
        try {
          const photo = await api.getBucketImage(
            fetchedStudentInfo.profilePhoto,
          );
          fetchedStudentInfo.photo = photo;
        } catch (error) {
          fetchedStudentInfo.photo = null;
          console.log(`Failed to fetch photo. Proceeding without it: ${error}`);
        }
      }
      await updateStudentInfo(fetchedStudentInfo);
      await AsyncStorage.setItem(STUDENT_ID, fetchedStudentInfo._id); // needs to be seperate
    } catch (error) {
      throw new Error("API error in getStudentInfo:", error);
    }
  } else {
    throw new Error("No internet connection in getStudentInfo");
  }
};

/**
 * Retrieves student information from AsyncStorage.
 * @returns {Promise<Object>} A promise that resolves with the fetched student information.
 */
export const getStudentInfo = async () => {
  return JSON.parse(await AsyncStorage.getItem(STUDENT_INFO));
};

export const getStudentProfilePhoto = async () => {
  const student = await getStudentInfo();
  return student.photo;
};

export const updateStudentInfo = async (studentInfo) => {
  await AsyncStorage.setItem(STUDENT_INFO, JSON.stringify(studentInfo));
};

// Increment studyStreak and update lastStudyDate
export const updateLocalStudyStreak = async (newStudyDate) => {
  // Retrieve current studentInfo
  const studentInfo = JSON.parse(await AsyncStorage.getItem(STUDENT_INFO));

  if (studentInfo) {
    studentInfo.studyStreak += 1;
    studentInfo.lastStudyDate = newStudyDate;

    // Save updated studentInfo
    await AsyncStorage.setItem(STUDENT_INFO, JSON.stringify(studentInfo));
  }
};

/** USER **/

/**
 * Retrieves user information from AsyncStorage.
 * @returns {Promise<Object>} A promise that resolves with the fetched user information.
 */
export const getUserInfo = async () => {
  const fetchedUserInfo = JSON.parse(await AsyncStorage.getItem(USER_INFO));
  if (fetchedUserInfo === null) {
    throw new Error("Cannot fetch user info from async storage");
  }
  return fetchedUserInfo;
};

/**
 * Stores user information in AsyncStorage.
 * @param {Object} userInfo - The user information to store.
 */
export const setUserInfo = async (userInfo) => {
  const obj = {
    id: userInfo.id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
  };
  await AsyncStorage.setItem(USER_INFO, JSON.stringify(obj));
  await AsyncStorage.setItem(USER_ID, userInfo.id); // needs to be separate
  await setStudentInfo(userInfo.id);
};

/**
 * Retrieves the JWT from AsyncStorage.
 * @returns {Promise<string>} A promise that resolves with the JWT.
 */
export const getJWT = async () => {
  return await AsyncStorage.getItem(LOGIN_TOKEN);
};

/**
 * Stores a JWT in AsyncStorage.
 * @param {string} jwt - The JWT to store.
 */
export const setJWT = async (jwt) => {
  await AsyncStorage.setItem(LOGIN_TOKEN, jwt);
};

export const getUserId = async () => {
  return await AsyncStorage.getItem(USER_ID);
};
/** COURSE AND COURSE LIST **/

/**
 * Retrieves a list of all courses.
 * @returns {Promise<Array>} A promise that resolves with a list of courses.
 */
export const getCourseList = async () => {
  let courseList = [];
  if (isOnline) {
    try {
      courseList = await api.getCourses();
    } catch (error) {
      if (error?.response?.data != null) {
        throw new Error("API error in getCourses:" + error.response.data);
      } else {
        throw new Error("API error in getCourses:" + error);
      }
    } finally {
      return await refreshCourseList(courseList);
    }
  } else {
    return courseList;
  }
};

/**
 * Refreshes the course list with updated data.
 * @param {Array} courseList - The list of courses to refresh.
 * @returns {Promise<Array>} A promise that resolves with the refreshed course list.
 */
const refreshCourseList = async (courseList) => {
  try {
    let newCourseList = [];
    if (courseList.length !== 0) {
      for (const course of courseList) {
        // Make new list with required members
        newCourseList.push({
          title: course.title,
          courseId: course._id,
          description: course.description,
          category: course.category,
          estimatedHours: course.estimatedHours,
          dateUpdated: course.dateUpdated,
          difficulty: course.difficulty,
          published: course.published,
          status: course.status,
          rating: course.rating,
          feedbackOptions: course.feedbackOptions,
          topFeedbackOptions: course.topFeedbackOptions,
        });
      }
    }
    // Save new courseList for this key and return it.
    return newCourseList;
  } catch (error) {
    handleError(error, "refreshCourseList");
  }
};

/** SECTIONS **/

/**
 * Retrieves a sections for a specific course.
 * @param {string} courseId - The ID of the sectiom
 * @returns {Promise<Object>} A promise that resolves with the section object.
 */
export const getSection = async (sectionId) => {
  let section = null;
  try {
    if (isOnline) {
      section = await api.getSectionById(sectionId);
    } else {
      throw new Error("No internet connection in getSection");
    }
  } catch (error) {
    // Use locally stored section if they exist and the DB cannot be reached
    try {
      section = JSON.parse(await AsyncStorage.getItem("S" + sectionId));
      throw new Error("JSON parse error in getSection", error);
    } catch (e) {
      handleError(e, "getSection");
    }
  } finally {
    return await refreshSection(section);
  }
};

/**
 * Refreshes the section with updated data.
 * @param {Array} section - The list section to refresh.
 * @returns {Promise<Object>} A promise that resolves with the refreshed section.
 */
export const refreshSection = async (section) => {
  let newSection = null;
  try {
    if (section !== null) {
      newSection = {
        title: section.title,
        sectionId: section._id,
        parentCourseId: section.parentCourse,
        description: section.description,
        components: section.components,
        total: section.totalPoints,
      };
    } else {
      throw new Error("Error in refreshSection: Missing field in section");
    }
  } catch (error) {
    handleError(error, "refreshSection");
  } finally {
    //Returns new fitted section, or null if there was no data fetched from DB or Storage,
    return newSection;
  }
};

/**
 * Retrieves a list of sections for a specific course.
 * @param {string} course_id - The ID of the course.
 * @returns {Promise<Array>} A promise that resolves with a list of sections for the course.
 */
export const getSectionList = async (course_id) => {
  let sectionList = null;
  try {
    if (isOnline) {
      sectionList = await api.getAllSections(course_id);
    } else {
      throw new Error("No internet connection in getSectionList");
    }
  } catch (error) {
    // Use locally stored section if they exist and the DB cannot be reached
    try {
      sectionList = JSON.parse(await AsyncStorage.getItem("S" + course_id));
      throw new Error("JSON parse error in getSectionList" + error);
    } catch (e) {
      handleError(e, "getSectionList");
    }
  } finally {
    return await refreshSectionList(sectionList);
  }
};

/**
 * Refreshes the section list with updated data.
 * @param {Array} sectionList - The list of sections to refresh.
 * @returns {Promise<Array>} A promise that resolves with the refreshed section list.
 */
export const refreshSectionList = async (sectionList) => {
  let newSectionList = [];
  try {
    if (sectionList !== null) {
      for (const section of sectionList) {
        newSectionList.push({
          title: section.title,
          sectionId: section._id,
          parentCourseId: section.parentCourse,
          description: section.description,
          components: section.components,
          total: section.totalPoints,
        });
      }
    } else {
      throw new Error(
        "Error in refreshSectionList: Missing field in sectionList",
      );
    }
  } catch (error) {
    handleError(error, "refreshSectionList");
  } finally {
    //Returns new fitted section list, or empty list if there was no data fetched from DB or Storage,
    return newSectionList;
  }
};

/** COMPONENTS **/

/**
 * Retrieves a list of components for a specific section.
 * @param {string} sectionID - The ID of the section.
 * @returns {Promise<Array>} A promise that resolves with a list of components for the section.
 */
// get all components for specific section
export const getComponentList = async (sectionID) => {
  let componentList = [];
  try {
    if (isOnline) {
      componentList = await api.getComponents(sectionID);
    } else {
      throw new Error("No internet connection in getComponentsList");
    }
  } catch (error) {
    // Use locally stored components if they exist and the DB cannot be reached
    try {
      if (
        (componentList = JSON.parse(
          await AsyncStorage.getItem("C" + sectionID),
        )) === null
      ) {
        throw new Error("JSON parse error in getComponentsList " + error);
      }
    } catch (e) {
      handleError(e, "getComponentList");
    }
  } finally {
    return componentList;
  }
};

/**
 * Fetches an image for a lecture.
 * @param {string} imageID - The ID of the image.
 * @param {string} lectureID - The ID of the lecture.
 * @returns {Promise<Object>} A promise that resolves with the lecture image.
 */
export const fetchLectureImage = async (imageID, lectureID) => {
  let image = null;
  try {
    if (isOnline) {
      image = await api.getBucketImage(imageID);
    } else {
      throw new Error("No internet connection in fetchLectureImage");
    }
  } catch (error) {
    // Use locally stored lectures if they exist and the DB cannot be reached
    try {
      if (
        (image = JSON.parse(await AsyncStorage.getItem("I" + lectureID))) ===
        null
      ) {
        throw new Error("JSON parse error in fetchLectureImage " + error);
      }
    } catch (e) {
      handleError(e, "fetchLectureImage");
    }
  } finally {
    return image;
  }
};

/**
 * gets videoURL for a Lecture if online, and video in base64 from file if offline
 * @param videoName
 * @param resolution
 * @returns {Promise<string>}
 */
export const getVideoURL = async (videoName, resolution) => {
  let videoUrl;
  if (!resolution) {
    resolution = "360";
  }
  try {
    if (isOnline) {
      videoUrl = api.getVideoStreamUrl(videoName, resolution);
    } else {
      throw new Error("No internet connection in getVideoUrl.");
    }
  } catch (error) {
    // Use locally stored video if they exist and the DB cannot be reached
    try {
      videoUrl = await FileSystem.readAsStringAsync(
        lectureVideoPath + videoName + ".json",
      );
    } catch (e) {
      handleError(e, "getVideoUrl");
    }
  } finally {
    return videoUrl;
  }
};

/** SUBSCRIPTIONS **/

/**
 * Retrieves a list of subscribed courses for a user.
 * @returns {Promise<Array>} A promise that resolves with the list of subscribed courses.
 */
export const getSubCourseList = async () => {
  // get the logged-in user id from async storage
  const userId = await AsyncStorage.getItem(USER_ID);

  if (userId === null) {
    throw new Error(
      "Cannot fetch user id from async storage in getSubCourseList",
    );
  }

  try {
    if (isOnline) {
      return await refreshSubCourseList(userId);
    } else {
      throw new Error("No internet connection in getSubCourseList");
    }
  } catch (error) {
    // Check if the course list already exists in AsyncStorage
    let courseList = JSON.parse(await AsyncStorage.getItem(SUB_COURSE_LIST));
    if (courseList !== null) {
      return courseList;
    }
    handleError(error, "getSubCourseList");
  }
};

/**
 * Refreshes the subscribed course list for a user.
 * @param {string} userId - The user ID.
 * @returns {Promise<Array>} A promise that resolves with the refreshed subscribed course list.
 */
export const refreshSubCourseList = async (userId) => {
  return await api
    .getSubscriptions(userId)
    .then(async (list) => {
      let newCourseList = [];
      for (const course of list) {
        // Make new list with required members
        newCourseList.push({
          title: course.title,
          courseId: course._id,
          description: course.description,
          category: course.category,
          estimatedHours: course.estimatedHours,
          dateUpdated: course.dateUpdated,
          difficulty: course.difficulty,
          published: course.published,
          status: course.status,
          rating: course.rating,
        });
      }
      // Save new courseList for this key and return it.
      await AsyncStorage.setItem(
        SUB_COURSE_LIST,
        JSON.stringify(newCourseList),
      );
      return newCourseList;
    })
    .catch((error) => {
      handleError(error, "refreshSubCourseList");
    });
};

/**
 * Subscribes a user to a course.
 * @param {string} courseId - The ID of the course to subscribe to.
 * @returns {Promise<Object>} A promise that resolves with the subscription result.
 */
export const subscribe = async (courseId) => {
  // get the logged-in user id from async storage
  const userId = await AsyncStorage.getItem(USER_ID);

  if (userId === null) {
    throw new Error("Cannot fetch user id from async storage");
  }

  try {
    await api.subscribeToCourse(userId, courseId);
  } catch (error) {
    handleError(error, "subscribe");
  }
};

export const addCourseToStudent = async (courseId) => {
  const userId = await AsyncStorage.getItem(USER_ID);
  const loginToken = await getLoginToken();

  try {
    const student = await userApi.addCourseToStudent(
      userId,
      courseId,
      loginToken,
    );
    if (!student) {
      throw new Error("Student not found");
    }

    await updateStudentInfo(student);
  } catch (e) {
    handleError(e, "addCourseToStudent");
  }
};

// unsubscribe to a course
/**
 * Unsubscribes a user from a course.
 * @param {string} courseId - The ID of the course to unsubscribe from.
 * @returns {Promise<Object>} A promise that resolves with the unsubscription result.
 */
export const unsubscribe = async (courseId) => {
  // get the logged-in user id from async storage
  const userId = await AsyncStorage.getItem(USER_ID);

  if (userId === null) {
    throw new Error("Cannot fetch user id from async storage");
  }

  try {
    if ((await AsyncStorage.getItem(courseId)) !== null) {
      deleteLocallyStoredCourse(courseId);
    }
    return await api.unSubscribeToCourse(userId, courseId);
  } catch (error) {
    handleError(error, "unsubscribe");
  }
};

/** Downloading course **/

//create a new folder to store videos if it does not already exist.
export const makeDirectory = async () => {
  await FileSystem.makeDirectoryAsync(lectureVideoPath, {
    intermediates: true,
  });
};

/**
 * Stores a course locally
 * @param {String} courseID - A string with the ID of the course to be stored
 * @returns {Promise<boolean>} A promise that resolves with `true` if the course was stored successfully.
 */

export const getAllCoursesLocally = async () => {
  let courseList = [];
  try {
    const keys = await AsyncStorage.getAllKeys();
    for (let key of keys) {
      if (!key.includes(await AsyncStorage.getItem(USER_ID))) continue;
      courseList.push(JSON.parse(await AsyncStorage.getItem(key)));
    }
  } catch (error) {
    if (error?.response?.data == null) {
      throw new Error(error);
    }
    throw new Error(error.response.data);
  }
  return courseList;
};

export const storeCourseLocally = async (courseID) => {
  let success = true;
  if (!isOnline) {
    return false;
  }
  try {
    //Stores the course data
    const course = await api.getCourse(courseID);
    await AsyncStorage.setItem(
      courseID + (await AsyncStorage.getItem(USER_ID)),
      JSON.stringify(course),
    );

    //Stores section data
    const sectionList = await api.getAllSections(courseID);
    await AsyncStorage.setItem("S" + courseID, JSON.stringify(sectionList));
    await storeLectureData(sectionList, course);
    await AsyncStorage.setItem(
      courseID + (await AsyncStorage.getItem(USER_ID)),
      JSON.stringify(course),
    );
  } catch (error) {
    success = false;
    deleteLocallyStoredCourse(courseID);
    if (error?.response?.data != null) {
      throw new Error(error.response.data);
    } else {
      throw new Error(error);
    }
  } finally {
    return success;
  }

  async function storeLectureData(sectionList, course) {
    for (let section of sectionList) {
      //Stores lecture data
      let componentList = await api.getComponents(section._id);
      await AsyncStorage.setItem(
        "C" + section._id,
        JSON.stringify(componentList),
      );
      for (let component of componentList) {
        if (component.type === "lecture") {
          if (component.component.contentType === "video") {
            await makeDirectory();
            await storeLectureVideo(component.component._id + "_l");
          }
          continue;
        }
        if (component.component.image) {
          //Stores images
          try {
            let image = await api.getBucketImage(component.component.image);
            await AsyncStorage.setItem(
              "I" + component.component._id,
              JSON.stringify(image),
            );
          } catch {
            await AsyncStorage.setItem(
              "I" + component.component._id,
              defaultImage.base64,
            );
          }
        } else if (component.component.video) {
          //Stores videos
          await makeDirectory();
          await FileSystem.writeAsStringAsync(
            lectureVideoPath + component.component.video + ".json",
            await api.getBucketImage(component.component.video),
          );
        }
      }

      //add a new variable "DateOfDownload" to the course object
      if (course.dateOfDownload === undefined) {
        course.dateOfDownload = new Date().toISOString();
      }
    }
  }
};

/**
 * Deletes a locally stored course.
 * @param {string} courseID - The ID of the course to remove from local storage.
 * @returns {Promise<boolean>} A promise that resolves with `true` if the course was deleted successfully.
 */
export const deleteLocallyStoredCourse = async (courseID) => {
  let success = true;
  try {
    await AsyncStorage.removeItem(
      courseID + (await AsyncStorage.getItem(USER_ID)),
    );

    const sectionList = JSON.parse(await AsyncStorage.getItem("S" + courseID));
    await AsyncStorage.removeItem("S" + courseID);
    await removeComponentsBySection(sectionList);
  } catch (error) {
    success = false;
    handleError(error, "deleteLocallyStoredCourse");
  } finally {
    return success;
  }

  async function removeComponentsBySection(sectionList) {
    for (let section of sectionList) {
      let componentList = JSON.parse(
        await AsyncStorage.getItem("C" + section._id),
      );
      await AsyncStorage.removeItem("C" + section._id);

      for (let component of componentList) {
        if (component.type !== "lecture") {
          continue;
        }
        if (component.lectureType === "video") {
          await deleteLectureVideo(component.component._id + "_l");
        }
        if (component.component.image) {
          await AsyncStorage.removeItem("I" + component._id);
        }
      }
    }
  }
};

/**
 * Updates all locally stored courses.
 */
export const updateStoredCourses = async () => {
  try {
    const subList = await getSubCourseList();
    for (const subListElement of subList) {
      let course;
      if (
        (course = JSON.parse(
          await AsyncStorage.getItem(
            subListElement.courseId + (await AsyncStorage.getItem(USER_ID)),
          ),
        )) !== null &&
        course.dateUpdated !== subListElement.dateUpdated
      ) {
        storeCourseLocally(subListElement.courseId);
      }
    }
  } catch (error) {
    handleError(error, "updateStoredCourses");
  }
};

/** Other **/

/**
 * Checks if a course is stored locally.
 * @param {string} courseID - The ID of the course to check.
 * @returns {Promise<boolean>} A promise that resolves with `true` if the course is stored locally.
 */
export const checkCourseStoredLocally = async (courseID) => {
  try {
    return !!(await AsyncStorage.getItem(
      courseID + (await AsyncStorage.getItem(USER_ID)),
    ));
  } catch (error) {
    handleError(error, "checkCourseStoredLocally");
  }
};

/**
 * Clears all data from AsyncStorage.
 */
export const clearAsyncStorage = async () => {
  console.log(await AsyncStorage.getAllKeys());
  await AsyncStorage.clear();
  console.log(await AsyncStorage.getAllKeys());
};

/**
 * Handles errors.
 * @param {Error} error - The error to handle.
 * @param {string} functionName - The name of the function where the error occurred.
 */

function handleError(error, functionName) {
  if (error?.response?.data != null) {
    throw new Error(`Error in ${functionName}: ${error.response.data}`);
  } else {
    throw new Error(`Error in ${functionName}: ${error}`);
  }
}

export async function getLectureVideo(videoName) {
  const filePath = `${lectureVideoPath}${videoName}.mp4`;

  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    return filePath;
  } catch (error) {
    return null;
  }
}

export async function storeLectureVideo(videoName) {
  try {
    // Get video data from API
    const videoData = await api.getBucketVideo(videoName);

    if (!videoData) {
      throw new Error("No video data");
    }

    const filePath = `${lectureVideoPath}${videoName}.mp4`;

    // Store video in file system
    await FileSystem.writeAsStringAsync(filePath, videoData, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return filePath;
  } catch (error) {
    console.log("Error storing video:", error);
    // Once the new version of transcoding service is deployed this can be uncommented.
    // handleError(error, 'storeLectureVideo');
  }
}

export async function deleteLectureVideo(videoName) {
  try {
    const filePath = `${lectureVideoPath}${videoName}.mp4`;

    await FileSystem.deleteAsync(filePath);
  } catch (error) {
    handleError(error, "deleteLectureVideo");
  }
}
