import { CourseSelection, CourseSelectionService, CourseService } from "@/api/backend";
import { mapToCourse, mapToSection } from "@/api/strapi-mapper";
import { sectionComponentDtoSchema } from "@/types/legacy-api-dto";
import { sectionModelSchema } from "@/types/legacy-api-model";
import { PopulatedCourse, PopulatedSection } from "@/types/strapi-populated";
import { AxiosResponse } from "axios";
import { mapToSectionComponent } from "./dto-mapper";

/**
 * Gets all components for a specific section.
 *
 * @param id - The section ID.
 * @returns A list of components.
 * @throws {@link AxiosError}
 */
export const getAllComponentsBySectionIdStrapi = async (id: string) => {
    const response = await CourseService.courseGetCoursesById(id)

    const parsed = sectionComponentDtoSchema.array().parse(response.data);

    return parsed.map(mapToSectionComponent);
};


/**
 * Gets a course by ID.
 *
 * @param courseId - The course ID.
 * @returns A course object.
 * @throws {@link AxiosError}
 */
export const getCourseByIdStrapi = async (courseId: string) => {

    const response = await CourseService.courseGetCoursesById(
        courseId,
        [
            'title',
            'description',
            'difficulty',
            'createdAt',
            'updatedAt',
            'publishedAt',
        ],
        [
            'course_categories',
            'content_creators',
            'image',
            'feedbacks',
            'course_sections',
            'students',
        ],
    ) as AxiosResponse<PopulatedCourse>;

    return mapToCourse(response.data);
};

/**
 * Gets all courses.
 *
 * @returns A list of courses.
 * @throws {@link AxiosError}
 */
export const getAllCoursesStrapi = async () => {
    const response = await CourseService.courseGetCourses(
        [
            'title',
            'description',
            'difficulty',
            'updatedAt',
            'createdAt',
            'publishedAt',
        ],
        undefined, // filters
        undefined, // q
        undefined, // pagination
        undefined, // sort
        [
            'course_categories',
            'content_creators',
            'image',
            'feedbacks',
            'course_sections',
            'students',
        ], // populate
    ) as AxiosResponse<PopulatedCourse[]>;

    return response.data.map(mapToCourse)
};


/**
 * Gets all sections for a specific course.
 *
 * @param id - The course ID.
 * @returns A list of sections.
 * @throws {@link AxiosError}
 */
export const getAllSectionsStrapi = async (id: string) => {
  const response = await CourseSelectionService.courseSelectionGetCourseSelections(
     [
            'title',
            'description',
        ],
        {
            course: {
                id: {
                    $eq: id
                }
            }
        }, // filters - now using the course ID
        undefined, // q
        undefined, // pagination
        undefined, // sort
        [
            'exercises',
            'lectures',
            'course',
        ], // populate
  ) as AxiosResponse<PopulatedSection[]>

  return response.data.map(mapToSection);
};