import type {
    ContentCreator as ContentCreatorStrapi,
    CourseCategory as CourseCategoryStrapi,
    Course as CourseStrapi,
    Exercise as ExerciseStrapi,
    Feedback as FeedbackStrapi,
    Lecture as LectureStrapi,
    Student as StudentStrapi,
    // TODO: Looks like the naming of the CourseSection is incorrect in the Strapi model.
    CourseSelection as CourseSectionStrapi
} from "@/api/backend/types.gen";

export type PopulatedCourse = Omit<CourseStrapi,
    'course_categories' |
    'content_creators' |
    'feedbacks' |
    'course_sections' |
    'students'
> & {
    course_categories?: CourseCategoryStrapi[];
    content_creators?: ContentCreatorStrapi[];
    feedbacks?: FeedbackStrapi[];
    course_sections?: CourseSectionStrapi[];
    students?: StudentStrapi[];
}


export type PopulatedSection = Omit<CourseSectionStrapi,
    'exercises' |
    'lectures' |
    'course'
> & {
    exercises?: ExerciseStrapi[];
    lectures?: LectureStrapi[];
    course?: PopulatedCourse;
}

export type PopulatedStudent = Omit<StudentStrapi,
    'courses'
> & {
    courses?: PopulatedCourse[];
}