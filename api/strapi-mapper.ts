import type { Component, Course, LoginStudent, Section, Student, StudentCourse } from "@/types";
import type { PopulatedCourse, PopulatedLoginResponse, PopulatedSection, PopulatedStudent } from "@/types/strapi-populated";

export const mapToCourse = (courseStrapi: PopulatedCourse): Course => {
    const categories = courseStrapi.course_categories ?? [];
    const contentCreators = courseStrapi.content_creators ?? [];

    return {
        courseId: courseStrapi.documentId?.toString() ?? '',
        title: courseStrapi.title,
        description: courseStrapi.description ?? '',
        category: categories.length > 0 ? categories[0].name : '',
        // TODO: Add to Strapi model
        estimatedHours: 0,
        dateUpdated: courseStrapi.updatedAt,
        // TODO: Add ability to have multiple content creators
        creatorId: contentCreators.length > 0 ? contentCreators[0].documentId?.toString() ?? '' : '',
        difficulty: courseStrapi.difficulty,
        published: !!courseStrapi.publishedAt,
        // TODO: Remove from course type or add to Strapi model
        status: 'published',

        rating: courseStrapi.feedbacks && courseStrapi.feedbacks.length > 0
            ? courseStrapi.feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / courseStrapi.feedbacks.length
            : 0,
        feedbackOptions: courseStrapi.feedbacks?.map((feedback) => ({
            id: feedback.documentId?.toString() ?? '',
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
            compId: exercise.documentId?.toString() ?? "",
            compType: "exercise" as const
        })),
        ...lectures.map(lecture => ({
            compId: lecture.documentId?.toString() ?? "",
            compType: "lecture" as const
        }))
    ];

    return {
        sectionId: courseSectionStrapi.documentId?.toString() ?? "",
        // TODO: parentCourseId not exist in Strapi model, but i guess it is the course relation
        parentCourseId: course?.documentId?.toString() ?? "",
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
        courseId: course.documentId?.toString() ?? '',
        totalPoints: 0, // TODO: Add to Strapi model or calculate from sections
        isComplete: false, // TODO: Add to Strapi model or calculate from sections
        sections: [], // TODO: Add sections data to Strapi model
        completionDate: new Date(), // TODO: Add to Strapi model
    }));

    return {
        id: studentStrapi.documentId?.toString() ?? '',
        points: 0, // TODO: Add to Strapi model
        currentExtraPoints: 0, // TODO: Add to Strapi model
        level: 1, // TODO: Add to Strapi model
        studyStreak: 0, // TODO: Add to Strapi model
        lastStudyDate: new Date(), // TODO: Add to Strapi model
        subscriptions: courses.map(course => course.documentId?.toString() ?? ''),
        profilePhoto: '', // TODO: Add to Strapi model
        photo: null,
        courses: studentCourses,
        baseUser: studentStrapi.email, // Using email as baseUser identifier
    };
};

export const mapToLoginStudent = (
    loginResponse: PopulatedLoginResponse,
): LoginStudent => ({
    accessToken: loginResponse.accessToken ?? '',
    userInfo: {
        id: loginResponse.userInfo?.documentId ?? '',
        firstName: loginResponse.userInfo?.name ?? '',
        lastName: loginResponse.userInfo?.name?.split(' ').slice(1).join(' ') ?? '',
        email: loginResponse.userInfo?.email ?? '',
        courses: loginResponse.courses.map(mapToStudentCourse),
        // TODO: Align strapi model with legacy model
        role: 'admin',
        // TODO: Align Strapi model with legacy model
        points: 0,
    },
});

const mapToStudentCourse = (course: PopulatedCourse): StudentCourse => ({
    courseId: course.documentId ?? '',
    // TODO: Align Strapi model with legacy model
    totalPoints: 0,
    // TODO: Align Strapi model with legacy model
    isComplete: false,
    // TODO: Align Strapi model with legacy model
    completionDate: new Date(),
    sections: course.course_sections?.map((section) => ({
        sectionId: section.documentId?.toString() ?? '',
        // TODO: Align Strapi model with legacy model
        totalPoints: 0,
        // TODO: Align Strapi model with legacy model
        extraPoints: 0,
        // TODO: Align Strapi model with legacy model
        isComplete: false,
        // TODO: Align Strapi model with legacy model
        completionDate: new Date(),
        // TODO: Align Strapi model with legacy model
        components: [],
    })) ?? [],
});