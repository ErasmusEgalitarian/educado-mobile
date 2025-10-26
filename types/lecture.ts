export type ContentType = "video" | "text";

export interface Lecture {
  _id: string;
  parentSection: string;
  title: string;
  description: string;
  contentType: ContentType;
  content: string;
  dateCreated: string;
  dateUpdated: string;
  __v: number;
}

export interface ApiLecture {
  _id: string;
  parentSection: string;
  title: string;
  description: string;
  contentType: ContentType;
  content: string;
  dateCreated: string;
  dateUpdated: string;
  __v: number;
}

//export interface ApiCourse extends Omit<Course, "courseId"> {
//  _id: string;
//}
