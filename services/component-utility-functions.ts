import type { Course } from "@/types";

export const recommendCourse = (
  filteredCourses: Course[],
): Course | undefined => {
  if (filteredCourses.length === 0) {
    return undefined;
  }

  const ratingsList = filteredCourses.map((course) => course.rating);
  const recommendedCourseId = ratingsList.indexOf(Math.max(...ratingsList));
  return filteredCourses[recommendedCourseId];
};
