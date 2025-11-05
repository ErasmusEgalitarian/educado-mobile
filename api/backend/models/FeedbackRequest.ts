/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FeedbackRequest = {
    data: {
        rating: number;
        feedbackText?: string;
        dateCreated: string;
        course?: (number | string);
        student?: (number | string);
        locale?: string;
        localizations?: Array<(number | string)>;
    };
};

