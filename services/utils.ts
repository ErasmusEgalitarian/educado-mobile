import * as StorageService from "@/services/storage-service";
import {
  completeComponent as apiCompleteComponent,
  getCourseById,
  createCertificate,
} from "@/api/legacy-api";
import "intl";
import "intl/locale-data/jsonp/en-GB";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "@/i18n";
import {
  Course,
  Icon,
  LoginStudent,
  ProgressTuple,
  Section,
  SectionComponent,
  SectionComponentExercise,
  SectionComponentLecture,
  Student,
  StudentCourse,
} from "@/types";
import { ClassValue, clsx } from "clsx";

/**
 * Converts a numeric difficulty level to a human-readable label.
 * @param level - The difficulty level of the course.
 * @returns The corresponding difficulty label in Portuguese.
 */
export const getDifficultyLabel = (level: number) => {
  switch (level) {
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
 * @param milliseconds - The number of milliseconds to convert.
 * @returns The time in the format 'MM:SS'.
 */
export const convertMsToTime = (milliseconds: number) => {
  if (milliseconds < 0) {
    return "00:00";
  }

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor(milliseconds / (1000 * 60));

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${mm}:${ss}`;
};

/**
 * Maps an English course category to its Portuguese equivalent.
 * @param category - The category of the course in English.
 * @returns The translated category label in Portuguese.
 */
export const determineCategory = (category: string) => {
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
 *
 * @param category - The category of the course.
 * @returns The icon name corresponding to the given category.
 */
export const determineIcon = (category: string): Icon => {
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
 *
 * @param courseDate - The date the course was last updated in ISO format.
 * @returns The formatted date in 'YYYY/MM/DD' format.
 */
export const getUpdatedDate = (courseDate: string) => {
  const date = new Date(courseDate);

  // Get the year, month, day, hours, and minutes from the Date object
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const day = date.getDate().toString().padStart(2, "0");

  // Format the date and time in the desired format
  return `${year}/${month}/${day}`;
};

/**
 * Calculates the complete difference in days between two dates, ignoring the time of day.
 * E.g., the difference in days between Monday 23:59 and Tuesday 00:01 is still 1 day.
 *
 * @param startDate - First day to compare.
 * @param endDate - Second day to compare.
 * @returns The complete difference in days between the two specified dates.
 * @throws {@link Error}
 * An error if specified dates are invalid or not instances of Date.
 */
export const differenceInDays = (startDate: Date, endDate: Date) => {
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("startDate/endDate is not a valid date!");
  }

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

  return differenceInMs / (1000 * 60 * 60 * 24);
};

/**
 * Determines if the two arrays of courses are different and require an update.
 *
 * @param courses1 - The first array of courses, typically representing the current state.
 * @param courses2 - The second array of courses, typically representing the new fetched data.
 * @returns True, if the two arrays are different and an update is required, false otherwise.
 */
export const shouldUpdate = (
  courses1: { courseId: string }[],
  courses2: { courseId: string }[] | null,
) => {
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
 *
 * @param number - The number of hours.
 * @returns A string combining the number and either "Hora" (singular) or "Horas" (plural). Returns "- Hora" for non-numeric or negative inputs.
 */
export const formatHours = (number: number) => {
  // Checking if it is not a number and if it is negative
  if (isNaN(number) || number <= 0) {
    return `- ${t("general.hour")}`;
  }

  if (number <= 1) {
    return `${String(number)} ${t("general.hour")}`;
  } else {
    return `${String(number)} ${t("general.hours")}`;
  }
};

export const formatDate = (dateString: string) => {
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

export const completeComponent = async (
  comp: SectionComponent<SectionComponentLecture | SectionComponentExercise>,
  courseId: string,
  isComplete: boolean,
) => {
  // Retrieve the user info object and parse it from JSON
  const studentInfo = await StorageService.getStudentInfo();

  if (!comp.component.parentSection) {
    throw new Error("Section ID not found");
  }

  const sectionId = comp.component.parentSection;

  if (
    !getComponent(
      studentInfo as unknown as Student,
      courseId,
      sectionId,
      comp.component.id,
    )
  ) {
    throw new Error("Component not found");
  }

  // Retrieve the user info object and parse it from JSON
  const userInfo = await StorageService.getUserInfo();

  const isFirstAttempt = isFirstAttemptExercise(studentInfo, comp.component.id);
  const isCompComplete = isComponentCompleted(studentInfo, comp.component.id);

  // If the exercise is present, but it's field "isComplete" is false, it means the user has answered wrong before and only gets 5 points.
  const points: number =
    isFirstAttempt && !isCompComplete && isComplete
      ? 10
      : !isFirstAttempt && !isCompComplete && isComplete
        ? 5
        : 0;

  const updatedStudent = await apiCompleteComponent(
    userInfo.id,
    comp.component,
    isComplete,
    points,
  );

  await StorageService.updateStudentInfo(updatedStudent);

  return { points, updatedStudent };
};

/**
 * A course is considered completed if all components in all sections are complete.
 *
 * @param student
 */
export const isCourseCompleted = (student: Student) => {
  return student.courses.some((course) =>
    course.sections.every((section) =>
      section.components.every((component) => component.isComplete),
    ),
  );
};

export const isSectionCompleted = (student: Student, sectionId: string) => {
  return student.courses.some((course) =>
    course.sections.some((section) => section.sectionId === sectionId),
  );
};

export const isComponentCompleted = (
  student: Student | LoginStudent,
  compId: string,
) => {
  let courses: StudentCourse[] = [];

  // Student
  if ("courses" in student) {
    courses = student.courses;
  }

  // LoginStudent
  if ("userInfo" in student) {
    courses = student.userInfo.courses;
  }

  return courses.some((course) =>
    course.sections.some((section) =>
      section.components.some(
        (component) => component.compId === compId && component.isComplete,
      ),
    ),
  );
};

export const isFirstAttemptExercise = (student: Student, compId: string) => {
  return student.courses.some((course) =>
    course.sections.some((section) =>
      section.components.some(
        (component) => component.compId === compId && component.isFirstAttempt,
      ),
    ),
  );
};

/**
 * Get the student's progress of a course.
 *
 * @param student - The student to check.
 * @param sections - The sections of the course to check.
 * @returns The students progress of a course as a tuple: [percentage completed, number of completed components, number
 * of total components].
 */
export const getCourseProgress = (
  student: Student | LoginStudent,
  sections: Section[],
): ProgressTuple => {
  let totalNumberOfComponents = 0;
  let numberOfCompletedComponents = 0;

  for (const section of sections) {
    totalNumberOfComponents += section.components.length;

    numberOfCompletedComponents += getNumberOfCompletedComponents(
      student,
      section,
    );
  }

  if (totalNumberOfComponents === 0) {
    return [0, 0, 0];
  }

  const progressPercentage = Math.floor(
    (numberOfCompletedComponents / totalNumberOfComponents) * 100,
  );

  return [
    progressPercentage,
    numberOfCompletedComponents,
    totalNumberOfComponents,
  ];
};

/**
 * Get the student's number of completed components in a section.
 *
 * @param student
 * @param section
 * @returns The number of completed components in the section.
 */
export const getNumberOfCompletedComponents = (
  student: Student | LoginStudent,
  section: Section,
) => {
  if (section.components.length === 0) {
    return 0;
  }

  let completedComponents = 0;

  for (const component of section.components) {
    if (component.compId && isComponentCompleted(student, component.compId)) {
      completedComponents++;
    }
  }

  return completedComponents;
};

export const findCompletedCourse = (student: Student, courseId: string) => {
  return student.courses.find((course) => course.courseId === courseId);
};

export const findCompletedSection = (
  student: Student,
  courseId: string,
  sectionId: string,
) => {
  const course = findCompletedCourse(student, courseId);

  return course?.sections.find((section) => section.sectionId === sectionId);
};

export const getComponent = (
  student: Student,
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

export const findIndexOfUncompletedComp = (
  student: Student,
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

  if (section.components.length === 0) {
    console.warn(
      `Section ${sectionId} in course ${courseId} has no components.`,
    );
    return -1; // or any other appropriate value to indicate no components
  }

  return section.components.findIndex((component) => !component.isComplete);
};

export const handleLastComponent = async (
  comp: SectionComponent<SectionComponentLecture | SectionComponentExercise>,
  course: Course,
  navigation: {
    reset: (opts: {
      index: number;
      routes: { name: string; params?: Record<string, unknown> }[];
    }) => void;
  },
) => {
  // Generate certificate
  const loginStudent = await StorageService.getUserInfo();
  await createCertificate(loginStudent, course);

  // get the full course from DB, to check what section we are in
  const getCurrentCourse = await getCourseById(course.courseId);

  // If the section is the last one, the course is completed
  const courseWithSections = getCurrentCourse as unknown as {
    sections: string[];
  };
  const getLastSection =
    courseWithSections.sections[courseWithSections.sections.length - 1];

  //Check if the section is the last one
  const isThisTheLastSection = getLastSection === comp.component.parentSection;

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
            sectionId: comp.component.parentSection,
          },
        },
      ],
    });
  }
};

export const resetOnboarding = async (uniqueKeys: string[]) => {
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

export const cn = (...inputs: ClassValue[]): string => clsx(...inputs);
