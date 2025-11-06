import { CourseService } from "@/api/backend";
import { FeedbackService } from "@/api/backend";
import { mapToSectionComponent } from "@/api/dto-mapper";
import { mapToCourse, mapToFeedbackOption } from "@/api/strapi-mapper";
import { sectionComponentDtoSchema } from "@/types/legacy-api-dto";
import { PopulatedCourse, PopulatedFeedback } from "@/types/strapi-populated";
import { AxiosResponse } from "axios";

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

export const getAllFeedbackOptionsStrapi = async () => {
    const response = await FeedbackService.feedbackGetFeedbacks(
        [
            'rating',
            'feedbackText',
            'dateCreated',
            'createdAt',
            'updatedAt',
            'publishedAt',
        ],
        undefined, // filters
        undefined, // q
        undefined, // pagination
        undefined, // sort
        [
            'course',
            'student',
            
        ], // 
    ) as AxiosResponse<PopulatedFeedback[]>;

    return response.data.map(mapToFeedbackOption);
};