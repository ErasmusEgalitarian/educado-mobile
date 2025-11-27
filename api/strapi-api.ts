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
  mapToStudent,
} from "@/api/strapi-mappers";
import { Course, LoginStudent, Section, Student } from "@/types";
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

    const courses = response.data?.courses ?? [];

    if (courses.length === 0) {
      console.log("No courses found for student");
      return [];
    }

    // Some student subscription entries may be relation objects with only id/documentId;
    // assert as PopulatedCourse to satisfy the mapper's expected input type.
    return courses.map((course) =>
      mapToCourse(course as unknown as PopulatedCourse),
    );
  } catch (error) {
    console.error("Error fetching student subscriptions:", error);
    throw error;
  }
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
      /* @ts-expect-error: Strapi filter typing does not support nested filters */
      "filters[course][documentId][$eq]": id,
      populate: ["exercises", "course", "lectures"],
      status: "published",
    },
  })) as CourseSelectionGetCourseSelectionsResponse;

  if (response.data == null) {
    throw new Error("No sections found");
  }

  console.log("Sections response dataEEEE:", response.data);

  return response.data.map((section) =>
    mapToSection(section as PopulatedSection),
  );
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
): Promise<Section[]> => {
  const response = (await courseSelectionGetCourseSelections({
    query: {
      /* @ts-expect-error: Strapi filter typing does not support nested filters */
      "filters[documentId][$eq]": id,
      populate: ["exercises", "course", "lectures"],
      status: "published",
    },
  })) as CourseSelectionGetCourseSelectionsResponse;

  if (response.data == null) {
    throw new Error("No section found");
  }

  return response.data.map((section) =>
    mapToSection(section as PopulatedSection),
  );
};
