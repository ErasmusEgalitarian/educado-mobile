import { LoginStudent, Student, StudentCourse } from "@/types";

export const isComponentCompleted = (
  student: Student | LoginStudent,
  compId: string,
) => {
  let courses: StudentCourse[] = [];

  // Student
  if ("courses" in student) {
    courses = student.courses;
  }

  // LoginStudent
  if ("userInfo" in student) {
    courses = student.userInfo.courses;
  }

  return courses.some((course) =>
    course.sections.some((section) =>
      section.components.some(
        (component) => component.compId === compId && component.isComplete,
      ),
    ),
  );
};
