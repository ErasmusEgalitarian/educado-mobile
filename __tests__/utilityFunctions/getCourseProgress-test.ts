import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import * as componentUtils from "@/services/component-utility-functions/getNumberOfCompletedComponents";
import { getCourseProgress } from "@/services/component-utility-functions/getCourseProgress";
import type { Student, Section, Component } from "@/types";

const createStudent = (): Student => ({
  id: "student-1",
  points: 0,
  currentExtraPoints: 0,
  level: 1,
  studyStreak: 0,
  lastStudyDate: new Date(),
  subscriptions: [],
  photo: null,
  profilePhoto: "",
  courses: [],
  baseUser: "user-id",
});

const createSection = (id: string, componentsCount: number): Section => {
  const components: Component[] = Array.from(
    { length: componentsCount },
    (ignored, idx) => ({
      compId: `${id}-comp-${String(idx)}`,
      compType: "lecture",
    }),
  );

  return {
    sectionId: id,
    title: `Section ${id}`,
    parentCourseId: "course-1",
    description: "",
    components,
    total: componentsCount,
  };
};

describe("getCourseProgress", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("returns [0, 0, 0] when there are no sections", () => {
    const student: Student = createStudent();

    const result = getCourseProgress(student, []);

    expect(result).toEqual([0, 0, 0]);
  });

  it("sums components and completed components across sections", () => {
    const student: Student = createStudent();

    const sections: Section[] = [
      createSection("s1", 3),
      createSection("s2", 2),
    ];

    const spy = jest
      .spyOn(componentUtils, "getNumberOfCompletedComponents")
      .mockImplementationOnce(() => 2)
      .mockImplementationOnce(() => 1);

    const result = getCourseProgress(student, sections);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, student, sections[0]);
    expect(spy).toHaveBeenNthCalledWith(2, student, sections[1]);
    expect(result).toEqual([60, 3, 5]);
  });

  it("floors the percentage value", () => {
    const student: Student = createStudent();
    const sections: Section[] = [createSection("s1", 3)];

    const spy = jest
      .spyOn(componentUtils, "getNumberOfCompletedComponents")
      .mockReturnValue(2);

    const result = getCourseProgress(student, sections);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual([66, 2, 3]);
  });

  it("returns [0, 0, 0] when all components arrays are empty", () => {
    const student: Student = createStudent();
    const sections: Section[] = [
      createSection("s1", 0),
      createSection("s2", 0),
    ];

    const spy = jest
      .spyOn(componentUtils, "getNumberOfCompletedComponents")
      .mockReturnValue(0);

    const result = getCourseProgress(student, sections);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(result).toEqual([0, 0, 0]);
  });
});
