export type ContentType = "video";

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
