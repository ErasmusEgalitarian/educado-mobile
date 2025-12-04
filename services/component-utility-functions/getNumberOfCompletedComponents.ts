import type { LoginStudent, Section, Student } from "@/types";
import { isComponentCompleted } from "@/services/component-utility-functions/isComponentCompleted";

/**
 * Get the student's number of completed components in a section.
 *
 * @param student
 * @param section
 * @returns The number of completed components in the section.
 */
export const getNumberOfCompletedComponents = (
  student: Student | LoginStudent,
  section: Section,
) => {
  if (section.components.length === 0) {
    return 0;
  }

  let completedComponents = 0;

  for (const component of section.components) {
    if (component.compId && isComponentCompleted(student, component.compId)) {
      completedComponents++;
    }
  }

  return completedComponents;
};
