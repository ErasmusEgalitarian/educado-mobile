/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CourseRequest = {
    data: {
        title: string;
        description?: string;
        difficulty: number;
        numOfRatings?: number;
        numOfSubscriptions?: number;
        image?: (number | string);
        feedbacks?: Array<(number | string)>;
        course_sections?: Array<(number | string)>;
        course_categories?: Array<(number | string)>;
        students?: Array<(number | string)>;
        content_creators?: Array<(number | string)>;
        locale?: string;
        localizations?: Array<(number | string)>;
    };
};

