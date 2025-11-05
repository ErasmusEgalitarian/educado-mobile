/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExerciseOptionRequest = {
    data: {
        text: string;
        explanation: string;
        isCorrect: boolean;
        exercise?: (number | string);
        locale?: string;
        localizations?: Array<(number | string)>;
    };
};

