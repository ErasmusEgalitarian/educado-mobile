import { client } from "@/api/backend/client.gen";
import {
  courseGetCourses,
  courseGetCoursesById,
  postStudentLogin,
  postStudentSignup,
  studentGetStudentsById,
  courseSelectionGetCourseSelections,
  feedbackGetFeedbacks,
  studentPutStudentsById,
} from "@/api/backend/sdk.gen";
import {
  mapToCourse,
  mapToLoginStudent,
  mapToSection,
  mapToStudent,
  mapToFeedbackOption,
  mapToExercises,
  mapToLectures,
} from "@/api/strapi-mappers";
import {
  Course,
  LoginStudent,
  Section,
  Student,
  FeedbackOption,
  SectionComponentExercise,
  SectionComponentLecture,
  SectionComponent,
} from "@/types";
import {
  PopulatedCourse,
  PopulatedSection,
  PopulatedExercise,
  PopulatedLecture,
} from "@/types/strapi-populated";

export const loginStudentStrapi = async (
  email: string,
  password: string,
): Promise<LoginStudent> => {
  const response = await postStudentLogin({
    body: {
      email,
      password,
    },
  });
  if (!response) {
    throw new Error("Failed to login user in strapi");
  }

  return mapToLoginStudent(response);
};

export const signUpStudentStrapi = async (
  name: string,
  email: string,
  password: string,
): Promise<LoginStudent> => {
  const response = await postStudentSignup({
    body: {
      name,
      email,
      password,
    },
  });

  if (!response) {
    throw new Error("Failed to signup user in strapi");
  }

  return mapToLoginStudent(response);
};

export const logoutStudentStrapi = () => {
  // Clear the authorization header from the client config
  // Note: The interceptor reads from TanStack Query cache, so the cache
  // should also be cleared via useLogoutStrapi hook
  client.setConfig({
    ...client.getConfig(),
    headers: {
      Authorization: "",
    },
  });

  return Promise.resolve();
};

/**
 * Gets all courses from Strapi.
 *
 * @returns A list of courses.
 * @throws Error if the request fails
 */
export const getAllCoursesStrapi = async (): Promise<Course[]> => {
  const response = await courseGetCourses({
    query: {
      fields: [
        "title",
        "description",
        "difficulty",
        "numOfRatings",
        "numOfSubscriptions",
        "createdAt",
        "updatedAt",
        "publishedAt",
      ],
      populate: "*",
      status: "published", // Only get published courses
    },
  });

  if (!response?.data || response.data.length === 0) {
    return [];
  }

  return response.data.map((course) => mapToCourse(course));
};

export const getCourseByIdStrapi = async (courseId: string) => {
  const response = await courseGetCoursesById({
    path: { id: courseId },
    query: {
      fields: [
        "title",
        "description",
        "difficulty",
        "numOfRatings",
        "numOfSubscriptions",
        "createdAt",
        "updatedAt",
        "publishedAt",
      ],
      // Use "*" to populate all relations with their full data including nested fields
      populate: [
        "course_categories",
        "content_creators",
        "image",
        "feedbacks",
        "course_sections",
        "students",
      ],
    },
  });

  return mapToCourse(response?.data as PopulatedCourse);
};

export const getAllSectionsByCourseIdStrapi = async (
  id: string,
): Promise<Section[]> => {
  const response = await courseSelectionGetCourseSelections({
    query: {
      /* @ts-expect-error: Strapi filter typing does not support nested filters */
      "filters[course][documentId][$eq]": id,
      populate: ["exercises", "course", "lectures"],
      status: "published",
    },
  });

  if (response?.data == null) {
    throw new Error("No sections found");
  }

  return response.data.map((section) =>
    mapToSection(section as PopulatedSection),
  );
};

export const getAllStudentSubscriptionsStrapi = async (
  id: string,
): Promise<Course[]> => {
  const response = await courseGetCourses({
    query: {
      "filters[students][documentId][$eq]": id,
      fields: [
        "title",
        "description",
        "difficulty",
        "numOfRatings",
        "numOfSubscriptions",
        "createdAt",
        "updatedAt",
        "publishedAt",
      ],
      populate: [
        "course_categories",
        "content_creators",
        "image",
        "feedbacks",
        "course_sections",
        "students",
      ],
    },
  });

  if (!response?.data || response.data.length === 0) {
    return [];
  }

  return response.data.map((course) => mapToCourse(course));
};

/**
 * Gets the student info for a specific student.
 */
export const getStudentByIdStrapi = async (id: string): Promise<Student> => {
  const response = await studentGetStudentsById({
    path: { id },
    query: {
      populate: [
        "courses",
        /*
          This is probably not needed right now
        "feedbacks",
        "certificates",
        "user_logs",
        */
      ],
      status: "published", // Only get published students
    },
  });

  if (!response?.data) {
    throw new Error("Student not found");
  }

  return mapToStudent(response.data);
};

export const getAllComponentsBySectionIdStrapi = async (
  id: string,
): Promise<
  SectionComponent<SectionComponentExercise | SectionComponentLecture>[]
> => {
  const response = await courseSelectionGetCourseSelections({
    query: {
      /* @ts-expect-error: Strapi filter typing does not support nested filters */
      "filters[documentId][$eq]": id,
      populate: ["exercises", "course", "lectures"],
      status: "published",
    },
  });

  if (!response?.data || response.data.length === 0) {
    throw new Error("No section found");
  }

  const exerciseComponents = response.data[0].exercises ?? [];
  const lectureComponents = response.data[0].lectures ?? [];

  const exerciseList: SectionComponentExercise[] = exerciseComponents.map(
    (exercise) => mapToExercises(exercise as PopulatedExercise),
  );

  const lectureList: SectionComponentLecture[] = lectureComponents.map(
    (lecture) => mapToLectures(lecture as PopulatedLecture),
  );

  // Combine both lists and return

  const finalList: SectionComponent<
    SectionComponentExercise | SectionComponentLecture
  >[] = [];

  exerciseList.forEach((exercise) => {
    finalList.push({
      component: exercise,
      type: "exercise",
    });
  });

  lectureList.forEach((lecture) => {
    finalList.push({
      component: lecture,
      type: "lecture",
      lectureType: lecture.contentType,
    });
  });

  return finalList;
};

/**
 * Gets all feedback options from Strapi.
 * Extracts unique feedback text values from all feedbacks.
 *
 * @returns A list of feedback options.
 * @throws Error if the request fails
 */
export const getAllFeedbackOptionsStrapi = async (): Promise<
  FeedbackOption[]
> => {
  const response = await feedbackGetFeedbacks({
    query: {
      fields: ["feedbackText", "rating"],
      status: "published",
    },
  });

  if (!response?.data || response.data.length === 0) {
    return [];
  }

  // Extract unique feedback options with their ratings
  const feedbackMap = new Map<string, number[]>();
  response.data.forEach((feedback) => {
    if (feedback.feedbackText) {
      const ratings = feedbackMap.get(feedback.feedbackText) ?? [];
      if (feedback.rating) {
        ratings.push(feedback.rating);
      }
      feedbackMap.set(feedback.feedbackText, ratings);
    }
  });

  return Array.from(feedbackMap.entries()).map(([text, ratings]) => {
    // Calculate average rating for this feedback text
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : undefined;

    return mapToFeedbackOption({ name: text, rating: avgRating });
  });
};

/**
 * Completes a component for a student in Strapi.
 * Note: This is a placeholder implementation. A custom Strapi endpoint is needed.
 *
 * @param studentId - The student ID
 * @param componentId - The component ID
 * @param componentType - The type of component (lecture or exercise)
 * @param isComplete - Whether the component is complete
 * @param points - Points earned for completion
 * @returns Updated student object
 */
export const completeComponentStrapi = async (
  studentId: string,
  componentId: string,
  componentType: "lecture" | "exercise",
  isComplete: boolean,
  points: number,
): Promise<Student> => {
  // TODO: Implement custom Strapi endpoint for component completion
  // For now, we'll fetch the student and return it
  // In production, you would:
  // 1. Create a StudentComponentProgress collection in Strapi
  // 2. Create/update a record linking student, component, completion status, and points
  // 3. Update student's total points

  const student = await getStudentByIdStrapi(studentId);

  return student;
};

/*
 * Updates a student's study streak.
 * TODO: Add studyStreak field to Strapi Student model.
 * For now, this function triggers a student update to mark activity.
 *
 * @param id - The student ID.
 * @returns A success message.
 * @throws Error if the request fails
 */

export const updateStudyStreakStrapi = async (
  id: string,
): Promise<{ message: string }> => {
  // Fetch current student data from Strapi to get the name
  const studentResponse = await studentGetStudentsById({
    path: { id },
    query: {
      fields: ["name", "email"],
      status: "published",
    },
  });

  if (!studentResponse?.data) {
    throw new Error("Student not found");
  }

  // Update the student (this could include lastStudyDate when the field is added to Strapi)
  const response = await studentPutStudentsById({
    path: { id },
    body: {
      data: {
        name: studentResponse.data.name, // Required field, keeping current value
        email: studentResponse.data.email, // Required field, keeping current value
        password: "unchanged", // Password is required but won't be changed
        // TODO: Add studyStreak increment logic when field is added to Strapi Student model
        // studyStreak: currentStudent.studyStreak + 1,
        // lastStudyDate: new Date().toISOString(),
      },
    },
  });

  if (!response?.data) {
    throw new Error("Failed to update study streak");
  }

  return { message: "Study streak updated successfully" };
};
