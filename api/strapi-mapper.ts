import type { Course } from "@/types";
import type { PopulatedCourse } from "@/types/strapi-populated";

export const mapToCourse = (courseStrapi: PopulatedCourse): Course => {
    const categories = courseStrapi.course_categories ?? [];
    const contentCreators = courseStrapi.content_creators ?? [];

    return {
        courseId: courseStrapi.id?.toString() ?? '',
        title: courseStrapi.title,
        description: courseStrapi.description ?? '',
        category: categories.length > 0 ? categories[0].name : '',
        // TODO: Add to Strapi model
        estimatedHours: 0,
        dateUpdated: courseStrapi.updatedAt,
        // TODO: Add ability to have multiple content creators
        creatorId: contentCreators.length > 0 ? contentCreators[0].id?.toString() ?? '' : '',
        difficulty: courseStrapi.difficulty,
        published: !!courseStrapi.publishedAt,
        // TODO: Remove from course type or add to Strapi model
        status: 'published',

        rating: courseStrapi.feedbacks && courseStrapi.feedbacks.length > 0
            ? courseStrapi.feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / courseStrapi.feedbacks.length
            : 0,
        feedbackOptions: courseStrapi.feedbacks?.map((feedback) => ({
            id: feedback.id?.toString() ?? '',
            count: feedback.rating,
        })) ?? [],
        topFeedbackOptions: courseStrapi.feedbacks?.sort((a, b) => b.rating - a.rating)[0]?.feedbackText ?? '',
        dateOfDownload: courseStrapi.createdAt,
        sections: courseStrapi.course_sections?.map((section) => section.title) ?? [],
    };
};

export const mapToFeedbackOption = (strapiData: any) => {
  return {
    id: strapiData.id,
    rating: strapiData.rating,
    feedbackText: strapiData.feedbackText,
    dateCreated: strapiData.dateCreated,
    createdAt: strapiData.createdAt,
    updatedAt: strapiData.updatedAt,
    publishedAt: strapiData.publishedAt,
  };
};