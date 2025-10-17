export interface StudentInfo {
  _id: string;
  photo: string | null;
  profilePhoto?: string;
  studyStreak: number;
  lastStudyDate: Date;
  level?: number;
  points?: number;
}
