export type LectureType = "text" | "video";

export interface Component {
  type: string;
  component: {
    contentType: string;
    title: string;
    _id: number;
  };
  lectureType?: LectureType;
}
