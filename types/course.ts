export type CourseStatus = "draft" | "published" | "archived";

export interface Course {
  title: string;
  courseId: string;
  description: string;
  category: string;
  estimatedHours: number;
  dateUpdated: string;
  difficulty: number;
  published: boolean;
  status: CourseStatus;
  rating: number;
  feedbackOptions: string;
  topFeedbackOptions: string;
  dateOfDownload: string;
}

export interface ApiCourse extends Omit<Course, "courseId"> {
  _id: string;
}
