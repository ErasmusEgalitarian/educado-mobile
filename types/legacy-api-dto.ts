import * as z from "zod";
import {
  courseModelSchema,
  exerciseModelSchema,
  feedbackOptionModelSchema,
  courseFeedbackOptionSchema,
  lectureModelSchema,
  lectureTypeSchema,
  sectionModelSchema,
  studentModelSchema,
  studyStreakModelSchema,
  studentSubscribedCourseModelSchema,
  leaderboardUserModelSchema,
  loginResponseModelSchema,
  studentCourseModelSchema,
} from "@/types/legacy-api-model";

export const sectionComponentLectureDtoSchema = z.object({
  component: lectureModelSchema,
  type: z.literal("lecture"),
  lectureType: lectureTypeSchema,
});

export type SectionComponentLectureDto = z.infer<
  typeof sectionComponentLectureDtoSchema
>;

export const sectionComponentExerciseDtoSchema = z.object({
  component: exerciseModelSchema,
  type: z.literal("exercise"),
});

export type SectionComponentExerciseDto = z.infer<
  typeof sectionComponentExerciseDtoSchema
>;

export const sectionComponentDtoSchema = z.union([
  sectionComponentLectureDtoSchema,
  sectionComponentExerciseDtoSchema,
]);

export type SectionComponentDto = z.infer<typeof sectionComponentDtoSchema>;

export type SectionDto = z.infer<typeof sectionModelSchema>;

export type CourseDto = z.infer<typeof courseModelSchema>;

export type StudentSubscribedCourseDto = z.infer<
  typeof studentSubscribedCourseModelSchema
>;

export type LectureDto = z.infer<typeof lectureModelSchema>;

export type FeedbackOptionDto = z.infer<typeof feedbackOptionModelSchema>;

export type CourseFeedbackOptionDto = z.infer<
  typeof courseFeedbackOptionSchema
>;

export type StudentCourseDto = z.infer<typeof studentCourseModelSchema>;

export type StudentDto = z.infer<typeof studentModelSchema>;

export type StudyStreakDto = z.infer<typeof studyStreakModelSchema>;

export interface AudioResponseDto {
  message: string;
  aiResponse: string;
  audio: string;
}

export interface UserInfoDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type LeaderboardUserDto = z.infer<typeof leaderboardUserModelSchema>;

export const leaderboardDtoSchema = z.object({
  currentUserRank: z.number(),
  leaderboard: leaderboardUserModelSchema.array(),
});

export type LeaderboardDto = z.infer<typeof leaderboardDtoSchema>;

export type LoginResponseDto = z.infer<typeof loginResponseModelSchema>;
