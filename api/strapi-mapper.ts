import { Course as CourseStrapi } from "@/api/backend/models/Course";
import { Course } from "@/types/domain";

export const mapToCourse = (
    courseStrapi: CourseStrapi
): Course | null => {

    const courseId = courseStrapi.id

    if (courseId === undefined) {
        return null
    }

    return {
        courseId: courseId.toString(),
        title: courseStrapi.title,
        description: courseStrapi.description ?? '',
        // TODO: Change new type to save category as array
        category: 'kaka',
        // TODO: Does not exist on strapi
        estimatedHours: 0,
        dateUpdated: courseStrapi.updatedAt,
        // TODO: gamer
        creatorId: courseStrapi.content_creators?.[0]?.id?.toString() ?? '',
        difficulty: courseStrapi.difficulty,
        published: undefined,
        status: 'draft',
        rating: 0,
        feedbackOptions: [],
        topFeedbackOptions: undefined,
        dateOfDownload: undefined,
        sections: [],
    }
}
