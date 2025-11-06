import {
  Student,
  Section,
  Course,
  Lecture,
  Component,
  FeedbackOption,
  LeaderboardUser,
  Leaderboard,
  SectionComponent,
  LoginStudent,
  StudentCourse,
  SectionComponentExercise,
  SectionComponentLecture,
} from "@/types";
import {
  CourseDto,
  FeedbackOptionDto,
  LectureDto,
  SectionComponentDto,
  SectionDto,
  StudentDto,
  CourseFeedbackOptionDto,
  StudentSubscribedCourseDto,
  LeaderboardUserDto,
  LeaderboardDto,
  LoginResponseDto,
  StudentCourseDto,
} from "@/types/legacy-api-dto";
import { isString } from "postcss-selector-parser";

export const mapToSectionComponent = (
  sectionComponentDto: SectionComponentDto,
): SectionComponent<SectionComponentLecture | SectionComponentExercise> => {
  if (sectionComponentDto.type === "exercise") {
    return {
      component: {
        id: sectionComponentDto.component._id,
        title: sectionComponentDto.component.title,
        question: sectionComponentDto.component.question,
        answers: sectionComponentDto.component.answers.map((answer) => ({
          text: answer.text,
          correct: answer.correct,
          feedback: answer.feedback,
        })),
        parentSection: sectionComponentDto.component.parentSection,
      },
      type: "exercise",
    };
  }

  // Lecture
  return {
    component: {
      id: sectionComponentDto.component._id,
      parentSection: sectionComponentDto.component.parentSection,
      title: sectionComponentDto.component.title ?? "",
      description: sectionComponentDto.component.description ?? "",
      contentType: sectionComponentDto.component.contentType,
      content: sectionComponentDto.component.content ?? "",
    },
    type: "lecture",
    lectureType: sectionComponentDto.lectureType,
  };
};

export const mapToSection = (sectionDto: SectionDto): Section => ({
  sectionId: sectionDto._id,
  parentCourseId: sectionDto.parentCourse,
  title: sectionDto.title ?? "",
  description: sectionDto.description ?? "",
  total: sectionDto.totalPoints,
  components:
    sectionDto.components?.map((component: Component) => ({
      compId: component.compId,
      compType: component.compType,
    })) ?? [],
});

export const mapToCourse = (
  courseDto: CourseDto | StudentSubscribedCourseDto,
): Course => {
  const creator = courseDto.creator;

  let creatorId;

  // CourseDto.creator
  if (creator !== null && typeof creator === "object" && "_id" in creator) {
    creatorId = creator._id;
  }

  // StudentSubscribedCourseDto.creator
  if (typeof creator === "string" && isString(creator) && creator.length > 0) {
    creatorId = creator;
  }

  return {
    courseId: courseDto._id,
    title: courseDto.title,
    description: courseDto.description,
    category: courseDto.category ?? "",
    estimatedHours: courseDto.estimatedHours ?? 0,
    difficulty: courseDto.difficulty,
    creatorId: creatorId,
    status: courseDto.status,
    rating: courseDto.rating ?? 0,
    feedbackOptions:
      courseDto.feedbackOptions?.map(
        (feedbackOption: CourseFeedbackOptionDto) => ({
          id: feedbackOption._id,
          count: feedbackOption.count,
        }),
      ) ?? [],
    sections: courseDto.sections,
  };
};

export const mapToLecture = (lectureDto: LectureDto): Lecture => ({
  id: lectureDto._id,
  parentSection: lectureDto.parentSection,
  title: lectureDto.title ?? "",
  description: lectureDto.description ?? "",
  contentType: lectureDto.contentType,
  content: lectureDto.content ?? "",
});

export const mapToFeedbackOption = (
  feedbackOptionDto: FeedbackOptionDto,
): FeedbackOption => ({
  name: feedbackOptionDto.name,
});

const mapToStudentCourse = (course: StudentCourseDto): StudentCourse => ({
  courseId: course.courseId,
  totalPoints: course.totalPoints,
  isComplete: course.isComplete,
  completionDate: new Date(course.completionDate),
  sections: course.sections.map((section) => ({
    sectionId: section.sectionId,
    totalPoints: section.totalPoints,
    extraPoints: section.extraPoints,
    isComplete: section.isComplete,
    completionDate: new Date(section.completionDate),
    components: section.components.map((component) => ({
      compId: component.compId,
      compType: component.compType,
      isComplete: component.isComplete,
      isFirstAttempt: component.isFirstAttempt,
      completionDate: new Date(component.completionDate),
      pointsGiven: component.pointsGiven ?? 0,
    })),
  })),
});

export const mapToStudent = (studentDto: StudentDto): Student => ({
  id: studentDto._id,
  points: studentDto.points,
  currentExtraPoints: studentDto.currentExtraPoints,
  level: studentDto.level,
  studyStreak: studentDto.studyStreak,
  lastStudyDate: new Date(studentDto.lastStudyDate),
  subscriptions: studentDto.subscriptions.map((subscription) => subscription),
  profilePhoto: studentDto.profilePhoto ?? "",
  photo: null,
  courses: studentDto.courses.map(mapToStudentCourse),
  baseUser: studentDto.baseUser,
});

export const mapToLoginStudent = (
  loginResponseDto: LoginResponseDto,
): LoginStudent => ({
  accessToken: loginResponseDto.accessToken,
  userInfo: {
    id: loginResponseDto.userInfo.id,
    firstName: loginResponseDto.userInfo.firstName,
    lastName: loginResponseDto.userInfo.lastName,
    email: loginResponseDto.userInfo.email,
    courses: loginResponseDto.userInfo.courses.map(mapToStudentCourse),
    role: loginResponseDto.userInfo.role,
    points: loginResponseDto.userInfo.points,
  },
});

export const mapToLeaderboardUser = (
  leaderboardUserDto: LeaderboardUserDto,
): LeaderboardUser => ({
  username: leaderboardUserDto.name,
  rank: leaderboardUserDto.rank,
  score: leaderboardUserDto.score,
  profilePicture: leaderboardUserDto.image,
});

export const mapToLeaderboard = (
  leaderboardDto: LeaderboardDto,
): Leaderboard => ({
  leaderboard: leaderboardDto.leaderboard.map(mapToLeaderboardUser),
  currentUserRank: leaderboardDto.currentUserRank,
});
