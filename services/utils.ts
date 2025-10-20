/** Utility functions used in Explore and Course screens **/
import * as StorageService from "@/services/storage-service";
import * as userApi from "@/api/user-api";
import * as api from "@/api/api";
import "intl";
import "intl/locale-data/jsonp/en-GB"; // Import the locale you need
import { generateCertificate } from "@/services/certificate-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Component } from "@/types/component";
import { t } from "@/i18n";

// Local utility types that reflect student progress structure used throughout utils
type ProgressComponent = Component & {
  compId: string;
  isComplete: boolean;
  isFirstAttempt?: boolean;
};

type ProgressSection = {
  sectionId: string;
  components: ProgressComponent[];
};

type ProgressCourse = {
  courseId: string;
  sections: ProgressSection[];
};

type StudentProgress = {
  courses: ProgressCourse[];
};

/**
 * Converts a numeric difficulty level to a human-readable label.
 * @param {number} lvl - The difficulty level of the course.
 * @returns {string} The corresponding difficulty label in Portuguese.
 */
const getDifficultyLabel = (lvl: number): string => {
  switch (lvl) {
    case 1:
      return t("difficulty.beginner");
    case 2:
      return t("difficulty.intermediate");
    case 3:
      return t("difficulty.advanced");
    default:
      return t("difficulty.beginner");
  }
};

/**
 * Converts milliseconds to time in the format 'MM:SS'.
 * @param {number} ms - The number of milliseconds to convert.
 * @returns {string} - The time in the format 'MM:SS'.
 */
const convertMsToTime = (ms: number): string => {
  if (ms < 0) {
    return "00:00";
  }

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor(ms / (1000 * 60));

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${mm}:${ss}`;
};

/**
 * Maps an English course category to its Portuguese equivalent.
 * @param {string} category - The category of the course in English.
 * @returns {string} - The translated category label in Portuguese.
 */
const determineCategory = (category: string): string => {
  switch (category) {
    case "personal finance":
      return t("categories.finance");
    case "health and workplace safety":
      return t("categories.health");
    case "sewing":
      return t("categories.sewing");
    case "electronics":
      return t("categories.electronics");
    default:
      return t("categories.other");
  }
};

/**
 * Determines the appropriate icon name for a given course category.
 * @param {string} category - The category of the course.
 * @returns {string} The icon name corresponding to the given category.
 */
const determineIcon = (category: string): string => {
  switch (category) {
    case "personal finance":
      return "finance";
    case "health and workplace safety":
      return "medical-bag";
    case "sewing":
      return "scissors-cutting";
    case "electronics":
      return "laptop";
    default:
      return "bookshelf";
  }
};

/**
 * Formats a date string into a standardized date format.
 * @param {string} courseDate - The date the course was last updated in ISO format.
 * @returns {string} The formatted date in 'YYYY/MM/DD' format.
 */
const getUpdatedDate = (courseDate: string): string => {
  const date = new Date(courseDate);

  // Get the year, month, day, hours, and minutes from the Date object
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = date.getDate().toString().padStart(2, "0");

  // Format the date and time in the desired format
  return `${year}/${month}/${day}`;
};

/**
 * Calculates the complete difference in days between two dates, ignoring the time of day.
 * E.g., the difference in days between monday 23:59 and tuesday 00:01 is still 1 day.
 * @param {Date} startDate - First day to compare.
 * @param {Date} endDate - Second day to compare.
 * @returns {number} - The complete difference in days between the two specified dates.
 * @throws {Error} - Throws an error if specified dates are invalid or not instances of Date.
 */
const differenceInDays = (startDate: Date, endDate: Date): number => {
  // Instance check
  if (!(startDate instanceof Date) || !(endDate instanceof Date))
    throw new Error("startDate/endDate is not a Date instance!");

  // Validity check
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
    throw new Error("startDate/endDate is not a valid date!");

  // Get dates without time by setting the time to midnight
  const startDateMidnight = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const endDateMidnight = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate(),
  );

  // Calculate the difference in milliseconds, and convert it to days
  const differenceInMs =
    endDateMidnight.getTime() - startDateMidnight.getTime();
  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

  return differenceInDays;
};

/**
 * Determines if the two arrays of courses are different and require an update.
 * @param {Array<number>} courses1 - The first array of courses, typically representing the current state.
 * @param {Array<number>} courses2 - The second array of courses, typically representing the new fetched data.
 * @returns {boolean} - Returns true if the two arrays are different and an update is required, otherwise false.
 */
const shouldUpdate = (
  courses1: { courseId: string }[],
  courses2: { courseId: string }[] | null,
): boolean => {
  // If both arrays are empty, they are equal, but should still update
  if (courses1.length === 0 && (courses2?.length ?? 0) === 0) {
    return true;
  }

  // If the lengths are different, they are not equal
  if (courses2 === null || courses1.length !== courses2.length) {
    return true;
  }

  // If the IDs are different, they are not equal
  for (let i = 0; i < courses1.length; i++) {
    if (courses1[i].courseId !== courses2[i].courseId) {
      return true;
    }
  }
  return false;
};

/**
 * Returns a string with the number and the correct form of "Hora/Horas" in Portuguese.
 * @param {number} number - The number of hours.
 * @returns {string} A string combining the number and either "Hora" (singular) or "Horas" (plural). Returns "- Hora" for non-numeric or negative inputs.
 */
const formatHours = (number: number): string => {
  // Checking if it is not a number and if it is negative
  if (typeof number !== "number" || isNaN(number) || number <= 0) {
    return `- ${t("general.hour")}`;
  }

  if (number <= 1) {
    return `${number} ${t("general.hour")}`;
  } else {
    return `${number} ${t("general.hours")}`;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
const completeComponent = async (
  comp: ProgressComponent,
  courseId: string,
  isComplete: boolean,
) => {
  // Retrieve the user info object and parse it from JSON
  const studentInfo =
    (await StorageService.getStudentInfo()) as unknown as StudentProgress;
  const sectionId = comp.parentSection as string;

  if (!getComponent(studentInfo, courseId, sectionId, comp._id)) {
    throw new Error("Component not found");
  }

  // Retrieve the user info object and parse it from JSON
  const userInfo = await StorageService.getUserInfo();
  const loginToken = await StorageService.getLoginToken();

  const isFirstAttempt = isFirstAttemptExercise(studentInfo, comp._id);
  const isCompComplete = isComponentCompleted(studentInfo, comp._id);

  // If the exercise is present, but it's field "isComplete" is false, it means the user has answered wrong before and only gets 5 points.
  const points =
    isFirstAttempt && !isCompComplete && isComplete
      ? 10
      : !isFirstAttempt && !isCompComplete && isComplete
        ? 5
        : 0;

  const updatedStudent = await userApi.completeComponent(
    userInfo.id,
    comp,
    isComplete,
    points,
    loginToken,
  );

  if (!updatedStudent) {
    throw new Error("Error completing component");
  }

  StorageService.updateStudentInfo(updatedStudent);

  return { points, updatedStudent };
};

const isCourseCompleted = (student: StudentProgress): boolean => {
  // A course is considered completed if all components in all sections are complete
  return student.courses.some((course) =>
    course.sections.every((section) =>
      section.components.every((component) => component.isComplete === true),
    ),
  );
};

const isSectionCompleted = (student: StudentProgress, sectionId: string) => {
  return student.courses.some((course) =>
    course.sections.some((section) => section.sectionId === sectionId),
  );
};

const isComponentCompleted = (student: StudentProgress, compId: string) => {
  return student.courses.some((course) =>
    course.sections.some((section) =>
      section.components.some(
        (component) => component.compId === compId && component.isComplete,
      ),
    ),
  );
};

const isFirstAttemptExercise = (student: StudentProgress, compId: string) => {
  return student.courses.some((course) =>
    course.sections.some((section) =>
      section.components.some(
        (component) => component.compId === compId && component.isFirstAttempt,
      ),
    ),
  );
};

// Returns the students progress of a course in percentage, and also returns completed and total components
const checkProgressCourse = async (
  courseId: string,
): Promise<[number, number, number]> => {
  try {
    const student =
      (await StorageService.getStudentInfo()) as unknown as StudentProgress;
    const sections = await StorageService.getSectionList(courseId);

    let totalComponents = 0;
    let progress = 0;

    for (let i = 0; i < sections.length; i++) {
      totalComponents += sections[i].components.length;
      for (let j = 0; j < sections[i].components.length; j++) {
        if (isComponentCompleted(student, sections[i].components[j].compId!)) {
          progress++;
        }
      }
    }

    let progressProcent = (progress / totalComponents) * 100;
    progressProcent = Math.floor(progressProcent); // Round down to the nearest integer
    return [progressProcent, progress, totalComponents];
  } catch {
    return [0, 0, 0];
  }
};

// Returns the students progress of a section
const checkProgressSection = async (sectionId: string): Promise<number> => {
  const student =
    (await StorageService.getStudentInfo()) as unknown as StudentProgress;
  const section = await StorageService.getSection(sectionId);

  if (section && section.components.length !== 0) {
    const totalComponents = section.components.length;
    let progress = 0;

    for (let i = 0; i < totalComponents; i++) {
      if (isComponentCompleted(student, section.components[i].compId!)) {
        progress++;
      }
    }

    return progress;
  } else {
    return 0;
  }
};

const findCompletedCourse = (student: StudentProgress, courseId: string) => {
  return student.courses.find((course) => course.courseId === courseId);
};

const findCompletedSection = (
  student: StudentProgress,
  courseId: string,
  sectionId: string,
) => {
  const course = findCompletedCourse(student, courseId);

  return course?.sections.find((section) => section.sectionId === sectionId);
};

const getComponent = (
  student: StudentProgress,
  courseId: string,
  sectionId: string,
  componentId: string,
) => {
  const course = student.courses.find((course) => course.courseId === courseId);
  const section = course?.sections.find(
    (section) => section.sectionId === sectionId,
  );

  return section?.components.find(
    (component) => component.compId === componentId,
  );
};

const findIndexOfUncompletedComp = (
  student: StudentProgress,
  courseId: string,
  sectionId: string,
) => {
  const course = student.courses.find((course) => course.courseId === courseId);

  if (!course) {
    console.error(`Course with ID ${courseId} not found for the student.`);
    return -1; // or any other appropriate value to indicate not found
  }

  const section = course.sections.find(
    (section) => section.sectionId === sectionId,
  );

  if (!section) {
    console.error(
      `Section with ID ${sectionId} not found in course ${courseId}.`,
    );
    return -1; // or any other appropriate value to indicate not found
  }

  if (!section.components || section.components.length === 0) {
    console.warn(
      `Section ${sectionId} in course ${courseId} has no components.`,
    );
    return -1; // or any other appropriate value to indicate no components
  }

  return section.components.findIndex((component) => !component.isComplete);
};

const handleLastComponent = async (
  comp: ProgressComponent,
  course: { courseId: string },
  navigation: {
    reset: (opts: {
      index: number;
      routes: { name: string; params?: Record<string, unknown> }[];
    }) => void;
  },
) => {
  // Generate certificate
  const courseId = course.courseId;
  const userId = await StorageService.getUserId();
  generateCertificate(courseId, userId);

  // get the full course from DB, to check what section we are in
  const getCurrentCourse = await api.getCourse(course.courseId);

  // If the section is the last one, the course is completed
  const courseWithSections = getCurrentCourse as unknown as {
    sections: string[];
  };
  const getLastSection =
    courseWithSections.sections[courseWithSections.sections.length - 1];

  //Check if the section is the last one
  const isThisTheLastSection = getLastSection === comp.parentSection;

  if (isThisTheLastSection) {
    // If the course is completed, navigate to the complete course screen
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "CompleteCourse",
          params: {
            course: course,
          },
        },
      ],
    });
  } else {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "CompleteSection",
          params: {
            parsedCourse: course,
            sectionId: comp.parentSection,
          },
        },
      ],
    });
  }
};

const resetOnboarding = async (uniqueKeys: string[]) => {
  try {
    const keysToRemove = uniqueKeys.map(
      (key: string) => `tooltip_shown_${key}`,
    );
    await AsyncStorage.multiRemove(keysToRemove);
    console.log("Removed keys:", keysToRemove);
  } catch (error) {
    console.error("Error removing keys:", error);
  }
};

export {
  getDifficultyLabel,
  convertMsToTime,
  determineCategory,
  determineIcon,
  getUpdatedDate,
  differenceInDays,
  shouldUpdate,
  formatHours,
  formatDate,
  completeComponent,
  isCourseCompleted,
  isSectionCompleted,
  checkProgressCourse,
  checkProgressSection,
  findCompletedCourse,
  findCompletedSection,
  findIndexOfUncompletedComp,
  handleLastComponent,
  resetOnboarding,
};
