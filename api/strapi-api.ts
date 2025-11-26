import { client } from "@/api/backend/client.gen";
import {
  courseGetCourses,
  courseGetCoursesById,
  postStudentLogin,
  postStudentSignup,
  studentGetStudentsById,
  courseSelectionGetCourseSelections,
} from "@/api/backend/sdk.gen";
import {
  CourseGetCoursesByIdResponse,
  CourseGetCoursesResponse,
  JwtResponse,
  StudentGetStudentsByIdResponse,
  CourseSelectionGetCourseSelectionsResponse,
} from "@/api/backend/types.gen";
import {
  mapToCourse,
  mapToLoginStudent,
  mapToSection,
} from "@/api/strapi-mappers";
import { Course, LoginStudent, Section } from "@/types";
import { PopulatedCourse, PopulatedSection } from "@/types/strapi-populated";

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
      populate: [
        "course_categories",
        "content_creators",
        "image",
        "feedbacks",
        "course_sections",
        "students",
      ],
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

/**
 * Gets the student info for a specific student.
 */
export const getAllStudentSubscriptionsStrapi = async (
  id: string,
): Promise<Course[]> => {
  const response = (await studentGetStudentsById({
    path: { id },
    query: {
      populate: ["courses"],
      status: "published", // Only get published courses
    },
  })) as StudentGetStudentsByIdResponse;

  const courses = response.data?.courses ?? [];

  if (courses.length === 0) {
    return [];
  }

  return courses.map((course) => mapToCourse(course as PopulatedCourse));
};
