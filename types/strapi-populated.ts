import type { Course as CourseStrapi } from "@/api/backend/models/Course";
import type { CourseCategory as CourseCategoryStrapi } from "@/api/backend/models/CourseCategory";
import type { ContentCreator as ContentCreatorStrapi } from "@/api/backend/models/ContentCreator";
// TODO: Looks like the naming of the CourseSection is incorrect in the Strapi model.
import type { CourseSelection as CourseSectionStrapi } from "@/api/backend/models/CourseSelection";
import type { Feedback as FeedbackStrapi } from "@/api/backend/models/Feedback";
import type { Student as StudentStrapi } from "@/api/backend/models/Student";
import { Exercise, Lecture } from "@/api/backend";

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
    'exercises'|
    'lectures' |
    'course'   
> & {
    exercises?: Exercise[];
    lectures?: Lecture[];
    course?: PopulatedCourse;
}