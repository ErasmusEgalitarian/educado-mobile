import { CourseService } from "@/api/backend";
import { mapToSectionComponent } from "@/api/dto-mapper";
import { mapToCourse } from "@/api/strapi-mapper";
import { sectionComponentDtoSchema } from "@/types/legacy-api-dto";

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
        ['course_categories', 'content_creators'], // populate
        undefined, // status
    )

    return response.data?.map(mapToCourse)
};