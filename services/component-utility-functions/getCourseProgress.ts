import type { LoginStudent, ProgressTuple, Section, Student } from "@/types";
import { getNumberOfCompletedComponents } from "@/services/component-utility-functions/getNumberOfCompletedComponents";

/**
 * Get the student's progress of a course.
 *
 * @param student - The student to check.
 * @param sections - The sections of the course to check.
 * @returns The students progress of a course as a tuple: [percentage completed, number of completed components, number
 * of total components].
 */
export const getCourseProgress = (
  student: Student | LoginStudent,
  sections: Section[],
): ProgressTuple => {
  let totalNumberOfComponents = 0;
  let numberOfCompletedComponents = 0;

  for (const section of sections) {
    totalNumberOfComponents += section.components.length;

    numberOfCompletedComponents += getNumberOfCompletedComponents(
      student,
      section,
    );
  }

  if (totalNumberOfComponents === 0) {
    return [0, 0, 0];
  }

  const progressPercentage = Math.floor(
    (numberOfCompletedComponents / totalNumberOfComponents) * 100,
  );

  return [
    progressPercentage,
    numberOfCompletedComponents,
    totalNumberOfComponents,
  ];
};
