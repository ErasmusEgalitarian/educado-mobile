import type {
  ContentCreator,
  Course,
  CourseCategory,
  CourseSelection,
  Exercise,
  ExerciseOption,
  Feedback,
  Student,
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
  exercises?: PopulatedExercise[];
  lectures?: PopulatedLecture[];
  course?: PopulatedCourse;
}

/**
 * Exercise with all relations populated
 */
export interface PopulatedExercise extends Omit<Exercise, "exercise_options"> {
  exercise_options?: ExerciseOption[];
}

/**
 * Lecture with all relations populated
 */
export type PopulatedLecture = Lecture;

/**
 * Student with all relations populated
 */
export interface PopulatedStudent
  extends Omit<Student, "feedbacks" | "courses"> {
  feedbacks?: Feedback[];
  courses?: PopulatedCourse[];
}
