export interface Course {
  title: string;
  courseId: string;
  description: string;
  category: string;
  estimatedHours: any;
  dateUpdated: any;
  difficulty: number;
  published: boolean;
  status: string;
  rating: number;
  feedbackOptions: string;
  topFeedbackOptions: string;
}

export interface ApiCourse extends Omit<Course, 'courseId'> {
  _id: string;
}
