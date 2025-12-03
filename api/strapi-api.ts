import { client } from "@/api/backend/client.gen";
import {
  courseGetCourses,
  courseGetCoursesById,
  postStudentLogin,
  postStudentSignup,
  studentGetStudentsById,
  courseSelectionGetCourseSelections,
  feedbackGetFeedbacks,
} from "@/api/backend/sdk.gen";
import {
  CourseGetCoursesByIdResponse,
  CourseGetCoursesResponse,
  JwtResponse,
  StudentGetStudentsByIdResponse,
  CourseSelectionGetCourseSelectionsResponse,
  FeedbackGetFeedbacksResponse,
} from "@/api/backend/types.gen";
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
  PopulatedExercise,
  PopulatedLecture,
  PopulatedSection,
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

  return mapToLoginStudent(response as JwtResponse);
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

  return mapToLoginStudent(response as JwtResponse);
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
  const response = (await courseGetCourses({
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
  })) as CourseGetCoursesResponse;

  if (!response.data || response.data.length === 0) {
    return [];
  }

  return response.data.map((course) => mapToCourse(course));
};

export const getCourseByIdStrapi = async (courseId: string) => {
  const response = (await courseGetCoursesById({
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
  })) as CourseGetCoursesByIdResponse;

  return mapToCourse(response.data as PopulatedCourse);
};

export const getAllSectionsByCourseIdStrapi = async (
  id: string,
): Promise<Section[]> => {
  const response = (await courseSelectionGetCourseSelections({
    query: {
      filters: {
        //TODO: wrong filter format - look at getAllStudentSubscriptionsStrapi
        "course[id][$eq]": id,
      },
      populate: ["exercises", "course", "lectures"],
      status: "published",
    },
  })) as CourseSelectionGetCourseSelectionsResponse;

  if (response.data == null) {
    throw new Error("No sections found");
  }

  return response.data.map((section) =>
    mapToSection(section as PopulatedSection),
  );
};

export const getAllStudentSubscriptionsStrapi = async (
  id: string,
): Promise<Course[]> => {
  const response = (await courseGetCourses({
    query: {
      /* @ts-expect-error: Strapi filter typing does not support nested filters */
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
  })) as CourseGetCoursesResponse;

  if (!response.data || response.data.length === 0) {
    return [];
  }

  return response.data.map((course) => mapToCourse(course));
};

/**
 * Gets the student info for a specific student.
 */
export const getStudentByIdStrapi = async (id: string): Promise<Student> => {
  const response = (await studentGetStudentsById({
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
  })) as StudentGetStudentsByIdResponse;

  if (!response.data) {
    throw new Error("Student not found");
  }

  return mapToStudent(response.data);
};

export const getAllComponentsBySectionIdStrapi = async (
  id: string,
): Promise<SectionComponent<SectionComponentExercise | SectionComponentLecture>[]> => {
  const response = (await courseSelectionGetCourseSelections({
    query: {
      /* @ts-expect-error: Strapi filter typing does not support nested filters */
      "filters[documentId][$eq]": id,
      populate: ["exercises", "course", "lectures"],
      status: "published",
    },
  })) as CourseSelectionGetCourseSelectionsResponse;

  if (!response.data || response.data.length === 0) {
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

  console.log("Exercises:", exerciseList);
  console.log("Lectures:", lectureList);

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
  const response = (await feedbackGetFeedbacks({
    query: {
      fields: ["feedbackText", "rating"],
      status: "published",
    },
  })) as FeedbackGetFeedbacksResponse;

  if (!response.data || response.data.length === 0) {
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
