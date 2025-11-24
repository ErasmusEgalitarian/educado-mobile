import { client } from "@/api/backend/client.gen";
import {
  courseGetCourses,
  postStudentLogin,
  postStudentSignup,
  studentGetStudentsById,
} from "@/api/backend/sdk.gen";
import {
  CourseGetCoursesResponse,
  JwtResponse,
  StudentGetStudentsByIdResponse,
  Course as StrapiCourse,
} from "@/api/backend/types.gen";
import { mapToCourse, mapToLoginStudent } from "@/api/strapi-mappers";
import { Course, LoginStudent } from "@/types";
import { PopulatedCourse } from "@/types/strapi-populated";

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

/**
 * Gets the student info for a specific student.
 */
export const getAllStudentSubscriptionsStrapi = async (
  id: string,
): Promise<Course[]> => {
  try {
    const response = (await studentGetStudentsById({
      path: { id },
      query: {
        populate: ["courses"],
      },
    })) as StudentGetStudentsByIdResponse;

    const courses = response.data?.courses || [];

    if (courses.length === 0) {
      console.log("No courses found for student");
      return [];
    }

    return courses
      .filter(
        (course): course is StrapiCourse | PopulatedCourse => course != null,
      )
      .map((course) => mapToCourse(course));
  } catch (error) {
    console.error("Error fetching student subscriptions:", error);
    throw error;
  }
};
