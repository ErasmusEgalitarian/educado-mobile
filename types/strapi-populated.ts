import type {
  ContentCreator,
  Course,
  CourseCategory,
  CourseSelection,
  Exercise,
  Feedback,
  Student,
} from "@/api/backend/types.gen";
import { Lecture } from ".";

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
  course_categories?: CourseCategory[];
  content_creators?: ContentCreator[];
  feedbacks?: Feedback[];
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
  exercises?: Exercise[];
  lectures?: Lecture[];
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
  feedbacks?: Feedback[];
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
