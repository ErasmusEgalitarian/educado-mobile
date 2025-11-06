import {
    courseGetCoursesById,
    courseGetCourses,
    courseSelectionGetCourseSelections,
    coursePutCoursesById,
    studentPutStudentsById,
    studentGetStudentsById
} from "@/api/backend/sdk.gen";
import {
    CourseGetCoursesByIdResponse,
    CourseGetCoursesResponse,
    CourseSelectionGetCourseSelectionsResponse,
    CoursePutCoursesByIdResponse,
    StudentPutStudentsByIdResponse,
    StudentGetStudentsByIdResponse,
} from "@/api/backend/types.gen";
import { mapToCourse, mapToSection } from "@/api/strapi-mapper";
import { PopulatedCourse, PopulatedSection } from "@/types/strapi-populated";

/**
 * Gets a course by ID.
 *
 * @param courseId - The course ID.
 * @returns A course object.
 * @throws {@link AxiosError}
 */
export const getCourseByIdStrapi = async (courseId: string) => {

    const courseResponse = await courseGetCoursesById({
        path: { id: courseId },
        query: {
            fields: ["title", "description", "difficulty", "numOfRatings", "numOfSubscriptions", "createdAt", "updatedAt", "publishedAt"],
            // Use "*" to populate all relations with their full data including nested fields
            populate: [
                'course_categories',
                'content_creators',
                'image',
                'feedbacks',
                'course_sections',
                'students',
            ],
        },
    }) as CourseGetCoursesByIdResponse;

    if (courseResponse.data == null) {
        throw new Error('Course not found');
    }

    return mapToCourse(courseResponse.data as PopulatedCourse);
};


/**
 * Gets all courses.
 *
 * @returns A list of courses.
 * @throws {@link AxiosError}
 */
export const getAllCoursesStrapi = async () => {
    const response = await courseGetCourses({
        query: {
            fields: ["title", "description", "difficulty", "numOfRatings", "numOfSubscriptions", "createdAt", "updatedAt", "publishedAt"],
            populate: [
                'course_categories',
                'content_creators',
                'image',
                'feedbacks',
                'course_sections',
                'students',
            ],
        },
    }) as CourseGetCoursesResponse;

    if (response.data == null) {
        throw new Error('No courses found');
    }

    return response.data.map(course => mapToCourse(course as PopulatedCourse));
};


/**
 * Gets all sections for a specific course.
 *
 * @param id - The course ID.
 * @returns A list of sections.
 * @throws {@link AxiosError}
 */
export const getAllSectionsStrapi = async (id: string) => {
    const response = await courseSelectionGetCourseSelections({
        query: {
            fields: ['title', 'description', 'createdAt', 'updatedAt', 'publishedAt'],
            filters: {
                'course[id][$eq]': id
            },
            populate: [
                'exercises',
                'lectures',
                'course',
            ],
        },
    }) as CourseSelectionGetCourseSelectionsResponse;

    if (response.data == null) {
        throw new Error('No sections found');
    }

    return response.data.map(section => mapToSection(section as PopulatedSection));
};


/**
 * Gets all courses a user is subscribed to.
 *
 * @param studentId - The user ID.
 * @returns A list of courses.
 * @throws {@link AxiosError}
 */
export const getAllStudentSubscriptionsStrapi = async (studentId: string) => {
    const response = await courseGetCourses({
        query: {
            fields: ["title", "description", "difficulty", "numOfRatings", "numOfSubscriptions", "createdAt", "updatedAt", "publishedAt"],
            filters: {
                'students[id][$eq]': studentId
            },
            populate: [
                'course_categories',
                'content_creators',
                'image',
                'feedbacks',
                'course_sections',
                'students',
            ],
        },
    }) as CourseGetCoursesResponse;

    if (response.data == null) {
        throw new Error('No student subscriptions found');
    }

    return response.data.map(course => mapToCourse(course as PopulatedCourse));
};


/**
 * Subscribes a user to a course by adding the student to the course's students array.
 *
 * @param studentId - The student ID.
 * @param courseId - The course ID.
 * @throws {@link AxiosError}
 */
export const subscribeCourseStrapi = async (studentId: string, courseId: string) => {
    // First, get the current course to retrieve existing students
    const courseResponse = await courseGetCoursesById({
        path: { id: courseId },
        query: {
            populate: ['students'],
        },
    }) as CourseGetCoursesByIdResponse;

    if (courseResponse.data == null) {
        throw new Error('Course not found');
    }

    const course = courseResponse.data;
    const currentStudents = Array.isArray(course.students)
        ? course.students.map(s => s.id?.toString() ?? '')
        : [];

    // Add the student if not already subscribed
    if (!currentStudents.includes(studentId)) {
        currentStudents.push(studentId);
    }

    // Update the course with the new students array
    const updateResponse = await coursePutCoursesById({
        path: { id: courseId },
        body: {
            data: {
                title: course.title,
                description: course.description ?? '',
                difficulty: course.difficulty,
                numOfRatings: course.numOfRatings,
                numOfSubscriptions: (course.numOfSubscriptions ?? 0) + 1,
                students: currentStudents,
            },
        },
    }) as CoursePutCoursesByIdResponse;

    return updateResponse.data;
};


/**
 * Unsubscribes a user from a course by removing the student from the course's students array.
 *
 * @param studentId - The student ID.
 * @param courseId - The course ID.
 * @throws {@link AxiosError}
 */
export const unsubscribeCourseStrapi = async (studentId: string, courseId: string) => {
    // First, get the current course to retrieve existing students
    const courseResponse = await courseGetCoursesById({
        path: { id: courseId },
        query: {
            populate: ['students'],
        },
    }) as CourseGetCoursesByIdResponse;

    if (courseResponse.data == null) {
        throw new Error('Course not found');
    }

    const course = courseResponse.data;
    const currentStudents = Array.isArray(course.students)
        ? course.students.map(s => s.id?.toString() ?? '')
        : [];

    // Remove the student from the array
    const updatedStudents = currentStudents.filter(id => id !== studentId);

    // Update the course with the new students array
    const updateResponse = await coursePutCoursesById({
        path: { id: courseId },
        body: {
            data: {
                title: course.title,
                description: course.description ?? '',
                difficulty: course.difficulty,
                numOfRatings: course.numOfRatings,
                numOfSubscriptions: Math.max((course.numOfSubscriptions ?? 0) - 1, 0),
                students: updatedStudents,
            },
        },
    }) as CoursePutCoursesByIdResponse;

    return updateResponse.data;
};


/**
 * Enrolls a student in a course by adding the course to the student's courses array.
 *
 * @param studentId - The student ID.
 * @param courseId - The course ID.
 * @returns A student object.
 * @throws {@link AxiosError}
 */
export const addCourseToStudentStrapi = async (studentId: string, courseId: string) => {
    // First, get the current student to retrieve existing courses
    const studentResponse = await studentGetStudentsById({
        path: { id: studentId },
        query: {
            populate: ['courses'],
        },
    }) as StudentGetStudentsByIdResponse;

    if (studentResponse.data == null) {
        throw new Error('Student not found');
    }

    const student = studentResponse.data;
    const currentCourses = Array.isArray(student.courses)
        ? student.courses.map(c => c.id?.toString() ?? '')
        : [];

    // Add the course if not already enrolled
    if (!currentCourses.includes(courseId)) {
        currentCourses.push(courseId);
    }


    // Update the student with the new courses array
    const updateResponse = await studentPutStudentsById({
        path: { id: studentId },
        body: {
            data: {
                name: student.name,
                email: student.email,
                password: student.name,
                biography: student.biography,
                verifiedAt: student.verifiedAt,
                courses: currentCourses,
            },
        },
    }) as StudentPutStudentsByIdResponse;

    return updateResponse.data;
};