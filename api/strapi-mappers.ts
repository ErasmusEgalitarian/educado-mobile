import {
  Course as StrapiCourse,
  CourseSelection as StrapiSection,
  JwtResponse,
} from "@/api/backend/types.gen";
import { Course, LoginStudent, Section, Component } from "@/types";
import { PopulatedCourse, PopulatedSection } from "@/types/strapi-populated";

/**
 * Maps a Strapi Course to the app Course type.
 *
 * @param courseStrapi - The Strapi course data
 * @returns A Course object
 */
export const mapToCourse = (
  courseStrapi: StrapiCourse | PopulatedCourse,
): Course => {
  const categories =
    "course_categories" in courseStrapi &&
    Array.isArray(courseStrapi.course_categories)
      ? courseStrapi.course_categories
      : [];
  const contentCreators =
    "content_creators" in courseStrapi &&
    Array.isArray(courseStrapi.content_creators)
      ? courseStrapi.content_creators
      : [];
  const feedbacks =
    "feedbacks" in courseStrapi && Array.isArray(courseStrapi.feedbacks)
      ? courseStrapi.feedbacks
      : [];
  const sections =
    "course_sections" in courseStrapi &&
    Array.isArray(courseStrapi.course_sections)
      ? courseStrapi.course_sections
      : [];

  // Calculate rating from feedbacks
  const rating =
    feedbacks.length > 0
      ? feedbacks.reduce((acc, feedback) => acc + (feedback.rating ?? 0), 0) /
        feedbacks.length
      : 0;

  // Get image URL if available
  const imageUrl = courseStrapi.image?.url ?? null;

  // Get category name
  const categoryName =
    categories.length > 0 &&
    typeof categories[0] === "object" &&
    "name" in categories[0]
      ? ((categories[0] as { name?: string }).name ?? "")
      : "";

  return {
    courseId: courseStrapi.documentId ?? "",
    title: courseStrapi.title,
    description: courseStrapi.description ?? "",
    image: imageUrl,
    category: categoryName,
    estimatedHours: 0, // TODO: Add to Strapi model (durationHours field exists but may need mapping)
    dateUpdated: courseStrapi.updatedAt,
    creatorId:
      contentCreators.length > 0 ? (contentCreators[0].documentId ?? "") : "",
    difficulty: courseStrapi.difficulty,
    published: !!courseStrapi.publishedAt,
    status: courseStrapi.publishedAt ? "published" : "draft",
    rating,
    feedbackOptions: feedbacks.map((feedback) => ({
      id: feedback.documentId ?? "",
      count: feedback.rating ?? 0,
    })),
    topFeedbackOptions:
      feedbacks.length > 0
        ? (feedbacks.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0]
            ?.feedbackText ?? "")
        : "",
    dateOfDownload: courseStrapi.createdAt,
    sections: sections.map((section) => section.documentId ?? ""),
  };
};

/**
 * Maps a Strapi JwtResponse to a LoginStudent.
 * This is a basic mapper that handles the essential user info.
 * TODO: Add courses mapping when course data is available.
 *
 * @param jwtResponse - The JWT response from Strapi login
 * @returns A LoginStudent object
 */
export const mapToLoginStudent = (jwtResponse: JwtResponse): LoginStudent => {
  if (!jwtResponse.accessToken || !jwtResponse.userInfo) {
    throw new Error("Invalid JWT response: missing accessToken or userInfo");
  }

  const { userInfo } = jwtResponse;
  const nameParts = (userInfo.name ?? "").split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  return {
    accessToken: jwtResponse.accessToken,
    userInfo: {
      id: userInfo.documentId ?? "",
      firstName,
      lastName,
      email: userInfo.email ?? "",
      courses: [], // TODO: Fetch and map courses from Strapi
      points: 0, // TODO: Add points to Strapi model or fetch from student data
      role: "user" as const, // TODO: Add role to Strapi model
    },
  };
};

/**
 * Maps a Strapi Course to the app Course type.
 *
 * @param courseStrapi - The Strapi course data
 * @returns A Course object
 */
export const mapToSection = (
  courseSectionStrapi: StrapiSection | PopulatedSection,
): Section => {
  const exercises = courseSectionStrapi.exercises ?? [];
  const lectures = courseSectionStrapi.lectures ?? [];
  const course = courseSectionStrapi.course;

  // Combine exercises and lectures into components
  const components: Component[] = [
    ...exercises.map((exercise) => ({
      compId: exercise.documentId?.toString() ?? "",
      compType: "exercise" as const,
    })),
    ...lectures.map((lecture) => ({
      compId: lecture.documentId?.toString() ?? "",
      compType: "lecture" as const,
    })),
  ];

  return {
    sectionId: courseSectionStrapi.documentId?.toString() ?? "",
    // TODO: parentCourseId not exist in Strapi model, but i guess it is the course relation
    parentCourseId: course?.documentId?.toString() ?? "",
    title: courseSectionStrapi.title,
    description: courseSectionStrapi.description ?? "",
    total: 177, // TODO: Strapi model does not have points currently"
    components: components,
  };
};
