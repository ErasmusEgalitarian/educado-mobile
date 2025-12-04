import { describe, it, expect } from "@jest/globals";
import { isComponentCompleted } from "@/services/component-utility-functions/isComponentCompleted";
import type {
  Student,
  LoginStudent,
  StudentCourse,
  StudentCourseSection,
  StudentCourseSectionComponent,
  LoginUserInfo,
} from "@/types";

const createComponent = (
  compId: string,
  isComplete: boolean,
): StudentCourseSectionComponent => ({
  compId,
  compType: "lecture",
  isComplete,
  isFirstAttempt: true,
  completionDate: new Date(),
  pointsGiven: 0,
});

const createSection = (
  sectionId: string,
  components: StudentCourseSectionComponent[],
): StudentCourseSection => ({
  sectionId,
  totalPoints: 0,
  extraPoints: 0,
  isComplete: false,
  completionDate: new Date(),
  components,
});

const createCourse = (
  courseId: string,
  sections: StudentCourseSection[],
): StudentCourse => ({
  courseId,
  totalPoints: 0,
  isComplete: false,
  sections,
  completionDate: new Date(),
});

const createStudent = (courses: StudentCourse[] = []): Student => ({
  id: "student-1",
  points: 0,
  currentExtraPoints: 0,
  level: 1,
  studyStreak: 0,
  lastStudyDate: new Date(),
  subscriptions: [],
  photo: null,
  profilePhoto: "",
  courses,
  baseUser: "user-id",
});

const createLoginStudent = (courses: StudentCourse[]): LoginStudent => {
  const userInfo: LoginUserInfo = {
    id: "login-user-1",
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    courses,
    points: 0,
    role: "user",
  };

  return {
    accessToken: "token",
    userInfo,
  };
};

describe("isComponentCompleted", () => {
  it("returns false when student has no courses", () => {
    const student: Student = createStudent();
    const result = isComponentCompleted(student, "comp-1");

    expect(result).toBe(false);
  });

  it("returns true when a matching completed component exists for Student", () => {
    const completed = createComponent("comp-1", true);
    const incomplete = createComponent("comp-2", false);
    const section = createSection("sec-1", [completed, incomplete]);
    const course = createCourse("course-1", [section]);
    const student: Student = createStudent([course]);

    const result = isComponentCompleted(student, "comp-1");

    expect(result).toBe(true);
  });

  it("returns false when compId matches but component is not complete", () => {
    const incomplete = createComponent("comp-1", false);
    const section = createSection("sec-1", [incomplete]);
    const course = createCourse("course-1", [section]);
    const student: Student = createStudent([course]);

    const result = isComponentCompleted(student, "comp-1");

    expect(result).toBe(false);
  });

  it("returns false when compId does not exist anywhere", () => {
    const completed = createComponent("comp-1", true);
    const section = createSection("sec-1", [completed]);
    const course = createCourse("course-1", [section]);
    const student: Student = createStudent([course]);

    const result = isComponentCompleted(student, "unknown-comp");

    expect(result).toBe(false);
  });

  it("works the same for LoginStudent (userInfo.courses)", () => {
    const completed = createComponent("comp-xyz", true);
    const section = createSection("sec-1", [completed]);
    const course = createCourse("course-1", [section]);
    const loginStudent: LoginStudent = createLoginStudent([course]);

    const result = isComponentCompleted(loginStudent, "comp-xyz");

    expect(result).toBe(true);
  });
});
