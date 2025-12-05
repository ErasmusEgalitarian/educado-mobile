import type {
  Certificate,
  ContentCreator,
  Course,
  CourseCategory,
  CourseSelection,
  Exercise,
  Feedback,
  Student,
  UserLog,
  Lecture,
} from "@/api/backend/types.gen";


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
  certificates?: Certificate[];
  user_logs?: UserLog[];
}
