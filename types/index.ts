import { MaterialCommunityIcons } from "@expo/vector-icons";

export type Icon = keyof typeof MaterialCommunityIcons.glyphMap;

export interface Answer {
  readonly text: string;
  readonly correct: boolean;
  readonly feedback: string;
}

export interface SectionComponentExercise {
  readonly id: string;
  readonly parentSection: string;
  readonly title: string;
  readonly question: string;
  readonly answers: Answer[];
}

export type LectureType = "video" | "text";

export interface SectionComponentLecture {
  readonly id: string;
  readonly parentSection: string;
  readonly title: string;
  readonly description: string;
  readonly contentType: LectureType;
  readonly content: string;
}

export type CompType = "lecture" | "exercise";

export interface SectionComponent<
  T extends SectionComponentLecture | SectionComponentExercise,
> {
  readonly component: T;
  readonly type: CompType;
  readonly lectureType?: LectureType;
}

export interface Component {
  readonly compId: string;
  readonly compType: CompType;
}

export interface Section {
  readonly sectionId: string;
  readonly title: string;
  readonly parentCourseId: string;
  readonly description: string;
  readonly components: Component[] | [];
  readonly total: number;
}

export type Status = "published" | "draft" | "hidden";

export interface CourseFeedbackOption {
  readonly id: string;
  readonly count: number;
}

export interface Course {
  readonly courseId: string;
  readonly title: string;
  readonly description: string;
  readonly image: string | null;
  readonly category: string;
  readonly estimatedHours: number;
  readonly dateUpdated?: string;
  readonly creatorId?: string;
  readonly difficulty: number;
  readonly published?: boolean;
  readonly status: Status;
  readonly rating: number;
  readonly feedbackOptions: CourseFeedbackOption[] | [];
  readonly topFeedbackOptions?: string;
  readonly dateOfDownload?: string;
  readonly sections: string[];
}

export type ContentType = "video" | "text";

export interface Lecture {
  readonly id: string;
  readonly parentSection: string;
  readonly description: string;
  readonly title: string;
  readonly contentType: ContentType;
  readonly content: string;
}

export interface FeedbackOption {
  readonly name: string;
}

export interface StudentCourseSectionComponent {
  readonly compId: string;
  readonly compType: CompType;
  readonly isComplete: boolean;
  readonly isFirstAttempt: boolean;
  readonly completionDate: Date;
  readonly pointsGiven: number;
}

export interface StudentCourseSection {
  readonly sectionId: string;
  readonly totalPoints: number;
  readonly extraPoints: number;
  readonly isComplete: boolean;
  readonly completionDate: Date;
  readonly components: StudentCourseSectionComponent[];
}

export interface StudentCourse {
  readonly courseId: string;
  readonly totalPoints: number;
  readonly isComplete: boolean;
  readonly sections: StudentCourseSection[];
  readonly completionDate: Date;
}

export interface Student {
  readonly id: string;
  readonly points: number;
  readonly currentExtraPoints: number;
  readonly level: number;
  studyStreak: number;
  lastStudyDate: Date;
  readonly subscriptions: string[];
  photo: string | null;
  readonly profilePhoto: string;
  readonly courses: StudentCourse[];
  readonly baseUser: string;
}

export type Role = "admin" | "user" | "creator";

export interface LoginUserInfo {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly courses: StudentCourse[];
  readonly points: number;
  readonly role: Role;
}

export interface LoginStudent {
  readonly accessToken: string;
  readonly userInfo: LoginUserInfo;
}

export type Sender = "User" | "Chatbot";

export interface ChatMessage {
  readonly sender: Sender;
  readonly text: string;
  readonly audio?: string;
}

export interface AudioResponse {
  readonly message: string;
  readonly aiResponse: string;
  readonly audio: string;
}

export interface User {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

export interface LeaderboardUser {
  readonly rank: number;
  readonly profilePicture: string | null;
  readonly score: number;
  readonly username: string;
}

export interface Leaderboard {
  readonly leaderboard: LeaderboardUser[];
  readonly currentUserRank: number;
}

export interface OnlineObserver {
  update(isOnline: boolean): void;
}

export type ProgressTuple = [number, number, number];
