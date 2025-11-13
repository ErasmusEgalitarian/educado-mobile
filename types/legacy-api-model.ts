import * as z from "zod";

export const objectIdSchema = z.string();

export const mongooseBaseObjectSchema = z.object({
  _id: objectIdSchema,
});

export const roleSchema = z.union([
  z.literal("admin"),
  z.literal("user"),
  z.literal("creator"),
]);

export const userModelSchema = mongooseBaseObjectSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  joinedAt: z.date().optional(),
  dateUpdated: z.date().optional(),
  resetAttempts: z.array(z.date()).optional(),
  role: roleSchema,
  __v: z.number(),
});

export const creatorModelSchema = mongooseBaseObjectSchema.extend({
  approved: z.boolean().optional(),
  rejected: z.boolean().optional(),
  rejectionReason: z.string().optional(),
  eUser: objectIdSchema.optional(),
  readonly: z.number().optional(),
});

export const feedbackOptionModelSchema = mongooseBaseObjectSchema.extend({
  name: z.string(),
});

export const feedbackModelSchema = mongooseBaseObjectSchema.extend({
  courseId: objectIdSchema,
  rating: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  feedbackText: z.string().optional(),
  feedbackOptions: z.array(objectIdSchema).optional(),
  dateCreated: z.date(),
});

export const categorySchema = z.union([
  z.literal("personal finance"),
  z.literal("health and workplace safety"),
  z.literal("sewing"),
  z.literal("electronics"),
]);

export const courseStatusSchema = z.union([
  z.literal("published"),
  z.literal("draft"),
  z.literal("hidden"),
]);

export const courseFeedbackOptionSchema = mongooseBaseObjectSchema.extend({
  count: z.number(),
});

export const courseBaseModelSchema = mongooseBaseObjectSchema.extend({
  title: z.string(),
  description: z.string(),
  dateCreated: z.iso.datetime().optional(),
  dateUpdated: z.iso.datetime().optional(),
  coverImg: z.string(),
  category: categorySchema.optional(),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  status: courseStatusSchema,
  estimatedHours: z.number().optional(),
  rating: z.number().optional(),
  numOfRatings: z.number().optional(),
  numOfSubscriptions: z.number().optional(),
  sections: z.array(objectIdSchema),
  feedbackOptions: z.array(courseFeedbackOptionSchema).optional(),
  __v: z.number(),
});

export const courseModelSchema = courseBaseModelSchema.extend({
  creator: creatorModelSchema.nullable(),
});

export const studentSubscribedCourseModelSchema = courseBaseModelSchema.extend({
  creator: z.string().nullable(),
});

export const compTypeSchema = z.union([
  z.literal("lecture"),
  z.literal("exercise"),
]);

export const sectionComponentModelSchema = mongooseBaseObjectSchema.extend({
  compId: objectIdSchema,
  compType: compTypeSchema,
});

export const sectionModelSchema = mongooseBaseObjectSchema.extend({
  title: z.string().optional(),
  description: z.string().optional(),
  components: z.array(sectionComponentModelSchema).optional(),
  sectionNumber: z.number().optional(),
  totalPoints: z.number(),
  dateCreated: z.iso.datetime(),
  dateUpdated: z.iso.datetime(),
  parentCourse: objectIdSchema,
  __v: z.number(),
});

export const answerModelSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
  feedback: z.string(),
  dateUpdated: z.iso.datetime(),
});

export const exerciseModelSchema = mongooseBaseObjectSchema.extend({
  parentSection: objectIdSchema,
  title: z.string(),
  description: z.string().optional(),
  question: z.string(),
  answers: z.array(answerModelSchema),
  onWrongFeedback: objectIdSchema.optional(),
  dateCreated: z.iso.datetime().optional(),
  dateUpdated: z.iso.datetime().optional(),
});

export const oldLectureModelSchema = mongooseBaseObjectSchema.extend({
  title: z.string().optional(),
  description: z.string().optional(),
  parentSection: objectIdSchema,
  image: z.string().optional(),
  video: z.string().optional(),
  completed: z.boolean().optional(),
});

export const lectureTypeSchema = z.union([
  z.literal("video"),
  z.literal("text"),
]);

export const lectureModelSchema = mongooseBaseObjectSchema.extend({
  _id: z.string(),
  parentSection: objectIdSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  contentType: lectureTypeSchema,
  content: z.string().optional(),
  dateCreated: z.iso.datetime().optional(),
  dateUpdated: z.iso.datetime().optional(),
  __v: z.number(),
});

export const completionDateSchema = z.object({
  completionDate: z.iso.datetime(),
});

export const studentCourseSectionComponentModelSchema = mongooseBaseObjectSchema
  .extend(completionDateSchema.shape)
  .extend({
    compId: objectIdSchema,
    compType: compTypeSchema,
    isComplete: z.boolean(),
    isFirstAttempt: z.boolean(),
    pointsGiven: z.number().optional(),
  });

export const studentCourseSectionModelSchema = mongooseBaseObjectSchema
  .extend(completionDateSchema.shape)
  .extend({
    sectionId: objectIdSchema,
    totalPoints: z.number(),
    extraPoints: z.number(),
    isComplete: z.boolean(),
    components: z.array(studentCourseSectionComponentModelSchema),
  });

export const studentCourseModelSchema = mongooseBaseObjectSchema
  .extend(completionDateSchema.shape)
  .extend({
    courseId: objectIdSchema,
    totalPoints: z.number(),
    isComplete: z.boolean(),
    sections: z.array(studentCourseSectionModelSchema),
  });

export const studentModelSchema = mongooseBaseObjectSchema.extend({
  _id: z.string(),
  points: z.number(),
  currentExtraPoints: z.number(),
  level: z.number(),
  studyStreak: z.number(),
  lastStudyDate: z.iso.datetime(),
  subscriptions: z.array(objectIdSchema),
  profilePhoto: z.string().optional(),
  courses: z.array(studentCourseModelSchema),
  baseUser: objectIdSchema,
});

export const studyStreakModelSchema = z.object({
  message: z.string(),
});

export const leaderboardUserModelSchema = z.object({
  baseUser: z.string(),
  image: z.string().nullable(),
  name: z.string(),
  rank: z.number(),
  score: z.number(),
});

export const loginUserModelSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  courses: studentCourseModelSchema.array(),
  points: z.number(),
  role: roleSchema,
});

export const loginResponseModelSchema = z.object({
  status: z.string(),
  accessToken: z.string(),
  userInfo: loginUserModelSchema,
});
