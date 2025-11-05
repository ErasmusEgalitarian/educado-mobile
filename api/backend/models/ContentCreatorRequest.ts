/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ContentCreatorRequest = {
    data: {
        firstName: string;
        lastName?: string;
        verifiedAt?: string;
        biography?: string;
        email: string;
        password: string;
        education: ContentCreatorRequest.education;
        statusValue: ContentCreatorRequest.statusValue;
        courseExperience: string;
        institution: string;
        eduStart: string;
        eduEnd: string;
        currentCompany: string;
        currentJobTitle: string;
        companyStart: string;
        companyEnd?: string;
        jobDescription?: string;
        courses?: Array<(number | string)>;
        user_logs?: Array<(number | string)>;
        locale?: string;
        localizations?: Array<(number | string)>;
    };
};
export namespace ContentCreatorRequest {
    export enum education {
        TODO1 = 'TODO1',
        TODO2 = 'TODO2',
        TODO3 = 'TODO3',
    }
    export enum statusValue {
        TODO1 = 'TODO1',
        TODO2 = 'TODO2',
        TODO3 = 'TODO3',
    }
}

