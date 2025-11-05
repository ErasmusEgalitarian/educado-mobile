/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentDescriptionComponent } from './ContentDescriptionComponent';
import type { ContentVideoComponent } from './ContentVideoComponent';
export type LectureRequest = {
    data: {
        title: string;
        completed?: boolean;
        content?: Array<(ContentVideoComponent | ContentDescriptionComponent)>;
        locale?: string;
        localizations?: Array<(number | string)>;
    };
};

