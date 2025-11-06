import type { Component, Course, Section, Student, StudentCourse } from "@/types";
import type { PopulatedCourse, PopulatedSection, PopulatedStudent } from "@/types/strapi-populated";

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


export const mapToSection = (courseSectionStrapi: PopulatedSection): Section => {
    const exercises = courseSectionStrapi.exercises ?? [];
    const lectures = courseSectionStrapi.lectures ?? [];
    const course = courseSectionStrapi.course;

    // Combine exercises and lectures into components
    const components: Component[] = [
        ...exercises.map(exercise => ({
            compId: exercise.id?.toString() ?? "",
            compType: "exercise" as const
        })),
        ...lectures.map(lecture => ({
            compId: lecture.id?.toString() ?? "",
            compType: "lecture" as const
        }))
    ];

    return {
        sectionId: courseSectionStrapi.id?.toString() ?? "",
        // TODO: parentCourseId not exist in Strapi model, but i guess it is the course relation
        parentCourseId: course?.id?.toString() ?? "",
        title: courseSectionStrapi.title,
        description: courseSectionStrapi.documentId ?? "",
        total: components.length,
        components
    };
};


export const mapToStudent = (studentStrapi: PopulatedStudent): Student => {
    const courses = studentStrapi.courses ?? [];

    // Map courses to StudentCourse format
    const studentCourses: StudentCourse[] = courses.map(course => ({
        courseId: course.id?.toString() ?? '',
        totalPoints: 0, // TODO: Add to Strapi model or calculate from sections
        isComplete: false, // TODO: Add to Strapi model or calculate from sections
        sections: [], // TODO: Add sections data to Strapi model
        completionDate: new Date(), // TODO: Add to Strapi model
    }));

    return {
        id: studentStrapi.id?.toString() ?? '',
        points: 0, // TODO: Add to Strapi model
        currentExtraPoints: 0, // TODO: Add to Strapi model
        level: 1, // TODO: Add to Strapi model
        studyStreak: 0, // TODO: Add to Strapi model
        lastStudyDate: new Date(), // TODO: Add to Strapi model
        subscriptions: courses.map(course => course.id?.toString() ?? ''),
        profilePhoto: '', // TODO: Add to Strapi model
        photo: null,
        courses: studentCourses,
        baseUser: studentStrapi.email, // Using email as baseUser identifier
    };
};