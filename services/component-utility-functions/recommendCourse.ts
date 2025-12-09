import { Course } from "@/types";

export const recommendCourse = (
  filteredCourses: Course[],
): Course | undefined => {
  if (filteredCourses.length === 0) {
    return undefined;
  }

  return filteredCourses.reduce((best, course) =>
    course.rating > best.rating ? course : best,
  );
};
