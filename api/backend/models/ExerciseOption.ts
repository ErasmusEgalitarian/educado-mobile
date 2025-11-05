/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExerciseOption = {
    id?: number;
    documentId?: string;
    text: string;
    explanation: string;
    isCorrect: boolean;
    exercise?: {
        id?: number;
        documentId?: string;
        title?: string;
        question?: string;
        exercise_options?: Array<{
            id?: number;
            documentId?: string;
            text?: string;
            explanation?: string;
            isCorrect?: boolean;
            exercise?: {
                id?: number;
                documentId?: string;
            };
            createdAt?: string;
            updatedAt?: string;
            publishedAt?: string;
            createdBy?: {
                id?: number;
                documentId?: string;
                firstname?: string;
                lastname?: string;
                username?: string;
                email?: string;
                resetPasswordToken?: string;
                registrationToken?: string;
                isActive?: boolean;
                roles?: Array<{
                    id?: number;
                    documentId?: string;
                    name?: string;
                    code?: string;
                    description?: string;
                    users?: Array<{
                        id?: number;
                        documentId?: string;
                    }>;
                    permissions?: Array<{
                        id?: number;
                        documentId?: string;
                        action?: string;
                        actionParameters?: any;
                        subject?: string;
                        properties?: any;
                        conditions?: any;
                        role?: {
                            id?: number;
                            documentId?: string;
                        };
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt?: string;
                        createdBy?: {
                            id?: number;
                            documentId?: string;
                        };
                        updatedBy?: {
                            id?: number;
                            documentId?: string;
                        };
                        locale?: string;
                        localizations?: Array<{
                            id?: number;
                            documentId?: string;
                        }>;
                    }>;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt?: string;
                    createdBy?: {
                        id?: number;
                        documentId?: string;
                    };
                    updatedBy?: {
                        id?: number;
                        documentId?: string;
                    };
                    locale?: string;
                    localizations?: Array<{
                        id?: number;
                        documentId?: string;
                    }>;
                }>;
                blocked?: boolean;
                preferedLanguage?: string;
                createdAt?: string;
                updatedAt?: string;
                publishedAt?: string;
                createdBy?: {
                    id?: number;
                    documentId?: string;
                };
                updatedBy?: {
                    id?: number;
                    documentId?: string;
                };
                locale?: string;
                localizations?: Array<{
                    id?: number;
                    documentId?: string;
                }>;
            };
            updatedBy?: {
                id?: number;
                documentId?: string;
            };
            locale?: string;
            localizations?: Array<{
                id?: number;
                documentId?: string;
            }>;
        }>;
        createdAt?: string;
        updatedAt?: string;
        publishedAt?: string;
        createdBy?: {
            id?: number;
            documentId?: string;
        };
        updatedBy?: {
            id?: number;
            documentId?: string;
        };
        locale?: string;
        localizations?: Array<{
            id?: number;
            documentId?: string;
        }>;
    };
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    createdBy?: {
        id?: number;
        documentId?: string;
    };
    updatedBy?: {
        id?: number;
        documentId?: string;
    };
    locale?: string;
    localizations?: Array<{
        id?: number;
        documentId?: string;
    }>;
};

