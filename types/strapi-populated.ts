import type { Course, CourseSelection, Student } from "@/api/backend/types.gen";

/**
 * Course Category with populated data
 */
export interface PopulatedCourseCategory {
  id?: number;
  documentId?: string;
  name?: string;
  courses?: PopulatedCourse[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Content Creator with populated data
 */
export interface PopulatedContentCreator {
  id?: number;
  documentId?: string;
  firstName?: string;
  lastName?: string;
  verifiedAt?: string;
  biography?: string;
  email?: string;
  courses?: PopulatedCourse[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Feedback with populated data
 */
export interface PopulatedFeedback {
  id?: number;
  documentId?: string;
  rating?: number;
  feedbackText?: string;
  dateCreated?: string;
  course?: PopulatedCourse;
  student?: PopulatedStudent;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Exercise with populated data
 */
export interface PopulatedExercise {
  id?: number;
  documentId?: string;
  title?: string;
  question?: string;
  exercise_options?: {
    id?: number;
    documentId?: string;
    text?: string;
    explanation?: string;
    isCorrect?: boolean;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Lecture with populated data
 */
export interface PopulatedLecture {
  id?: number;
  documentId?: string;
  title?: string;
  completed?: boolean;
  content?: unknown[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/**
 * Course with all relations populated
 */
export interface PopulatedCourse
  extends Omit<
    Course,
    | "course_categories"
    | "content_creators"
    | "feedbacks"
    | "course_sections"
    | "students"
  > {
  course_categories?: PopulatedCourseCategory[];
  content_creators?: PopulatedContentCreator[];
  feedbacks?: PopulatedFeedback[];
  course_sections?: PopulatedSection[];
  students?: PopulatedStudent[];
}

/**
 * Course Selection (Section) with all relations populated
 */
export interface PopulatedSection
  extends Omit<CourseSelection, "exercises" | "lectures" | "course"> {
  title: string;
  description: string;
  exercises?: PopulatedExercise[];
  lectures?: PopulatedLecture[];
  course?: PopulatedCourse;
}

/**
 * Student with all relations populated
 */
export interface PopulatedStudent
  extends Omit<
    Student,
    "feedbacks" | "courses" | "certificates" | "user_logs"
  > {
  feedbacks?: PopulatedFeedback[];
  courses?: PopulatedCourse[];
  certificates?: {
    id?: number;
    documentId?: string;
    link?: string;
    completionDate?: string;
    student?: PopulatedStudent;
    course?: PopulatedCourse;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }[];
  user_logs?: {
    id?: number;
    documentId?: string;
    loginDate?: string;
    isSuccessful?: boolean;
    student?: PopulatedStudent;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }[];
}

/**
 * Login response with populated user courses
 */
export interface PopulatedLoginResponse {
  accessToken?: string;
  userInfo?: {
    documentId?: string;
    name?: string;
    email?: string;
    verifiedAt?: string;
  };
  courses?: PopulatedCourse[];
}
