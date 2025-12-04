import { describe, it, expect } from "@jest/globals";
import type { Course, CourseFeedbackOption } from "@/types";
import { recommendCourse } from "@/services/component-utility-functions/recommendCourse";

describe("recommendCourse", () => {
  it("returns the course with the highest rating", () => {
    const mockCourses: Course[] = [
      {
        courseId: "1",
        title: "",
        description: "",
        image: null,
        category: "",
        estimatedHours: 1,
        difficulty: 1,
        status: "published",
        rating: 3.5,
        feedbackOptions: [] as CourseFeedbackOption[],
        sections: [],
      },
      {
        courseId: "2",
        title: "",
        description: "",
        image: null,
        category: "",
        estimatedHours: 1,
        difficulty: 1,
        status: "published",
        rating: 4.8,
        feedbackOptions: [] as CourseFeedbackOption[],
        sections: [],
      },
      {
        courseId: "3",
        title: "",
        description: "",
        image: null,
        category: "",
        estimatedHours: 1,
        difficulty: 1,
        status: "published",
        rating: 4.2,
        feedbackOptions: [] as CourseFeedbackOption[],
        sections: [],
      },
    ];

    const result = recommendCourse(mockCourses);

    expect(result).toEqual(mockCourses[1]);
  });

  it("returns the first course when there is a tie for highest rating", () => {
    const mockCourses: Course[] = [
      {
        courseId: "1",
        title: "",
        description: "",
        image: null,
        category: "",
        estimatedHours: 3,
        difficulty: 1,
        status: "published",
        rating: 4.8,
        feedbackOptions: [] as CourseFeedbackOption[],
        sections: [],
      },
      {
        courseId: "2",
        title: "",
        description: "",
        image: null,
        category: "",
        estimatedHours: 5,
        difficulty: 2,
        status: "published",
        rating: 4.8,
        feedbackOptions: [] as CourseFeedbackOption[],
        sections: [],
      },
    ];

    const result = recommendCourse(mockCourses);

    expect(result).toEqual(mockCourses[0]);
  });

  it("handles a single-course array", () => {
    const mockCourses: Course[] = [
      {
        courseId: "1",
        title: "",
        description: "",
        image: null,
        category: "",
        estimatedHours: 1,
        difficulty: 1,
        status: "published",
        rating: 4.8,
        feedbackOptions: [] as CourseFeedbackOption[],
        sections: [],
      },
    ];

    const result = recommendCourse(mockCourses);

    expect(result).toBe(mockCourses[0]);
  });

  it("returns undefined if no courses are provided", () => {
    const mockCourses: Course[] = [];

    const result = recommendCourse(mockCourses);

    expect(result).toBeUndefined();
  });
});
