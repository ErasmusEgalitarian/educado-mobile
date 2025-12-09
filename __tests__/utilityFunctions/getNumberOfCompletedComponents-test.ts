import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { getNumberOfCompletedComponents } from "@/services/component-utility-functions/getNumberOfCompletedComponents";
import * as isCompletedModule from "@/services/component-utility-functions/isComponentCompleted";
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

const createSectionWithCompIds = (id: string, compIds: string[]): Section => {
  const components: Component[] = compIds.map((compId, idx) => ({
    compId: `${id}-${compId}-${String(idx)}`,
    compType: "lecture",
  }));

  return {
    sectionId: id,
    title: `Section ${id}`,
    parentCourseId: "course-1",
    description: "",
    components,
    total: components.length,
  };
};

describe("getNumberOfCompletedComponents", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 0 when the section has no components", () => {
    const student: Student = createStudent();
    const emptySection: Section = {
      sectionId: "s-empty",
      title: "Empty",
      parentCourseId: "course-1",
      description: "",
      components: [],
      total: 0,
    };

    const spy = jest.spyOn(isCompletedModule, "isComponentCompleted");

    const result = getNumberOfCompletedComponents(student, emptySection);

    expect(result).toBe(0);
    expect(spy).not.toHaveBeenCalled();
  });

  it("counts components for which isComponentCompleted returns true", () => {
    const student: Student = createStudent();
    const section: Section = createSectionWithCompIds("s1", ["a", "b", "c"]);

    const spy = jest
      .spyOn(isCompletedModule, "isComponentCompleted")
      .mockImplementationOnce(() => true)
      .mockImplementationOnce(() => false)
      .mockImplementationOnce(() => true);

    const result = getNumberOfCompletedComponents(student, section);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenNthCalledWith(
      1,
      student,
      section.components[0].compId,
    );
    expect(spy).toHaveBeenNthCalledWith(
      2,
      student,
      section.components[1].compId,
    );
    expect(spy).toHaveBeenNthCalledWith(
      3,
      student,
      section.components[2].compId,
    );
    expect(result).toBe(2);
  });

  it("does not call isComponentCompleted for components with falsy compId", () => {
    const student: Student = createStudent();

    const components: Component[] = [
      { compId: "", compType: "lecture" },
      { compId: "valid-1", compType: "lecture" },
      { compId: "valid-2", compType: "lecture" },
    ];

    const section: Section = {
      sectionId: "s2",
      title: "Mixed",
      parentCourseId: "course-1",
      description: "",
      components,
      total: components.length,
    };

    const spy = jest
      .spyOn(isCompletedModule, "isComponentCompleted")
      .mockReturnValue(true);

    const result = getNumberOfCompletedComponents(student, section);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, student, "valid-1");
    expect(spy).toHaveBeenNthCalledWith(2, student, "valid-2");
    expect(result).toBe(2);
  });
});
