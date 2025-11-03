/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CertificateService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static certificateGetCertificates(
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        filters?: Record<string, any>,
        q?: string,
        pagination?: ({
            withCount?: boolean;
        } & ({
            page: number;
            pageSize: number;
        } | {
            start: number;
            limit: number;
        })),
        sort?: ('link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: Array<{
            documentId: string;
            id: number;
            link: string;
            completionDate: string;
            createdAt?: string;
            updatedAt?: string;
            publishedAt: string;
            student?: {
                documentId: string;
                id: number;
                name: string;
                biography?: string;
                email: string;
                isVerified: boolean;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                feedbacks?: Array<{
                    documentId: string;
                    id: number;
                    rating: number;
                    feedbackText?: string;
                    dateCreated: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                    student?: any;
                }>;
                courses?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    difficulty: number;
                    numOfRatings: number;
                    numOfSubscriptions: number;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    image?: {
                        documentId: string;
                        id: number;
                        name: string;
                        alternativeText?: string;
                        caption?: string;
                        width?: number;
                        height?: number;
                        formats?: any;
                        hash: string;
                        ext?: string;
                        mime: string;
                        size: number;
                        url: string;
                        previewUrl?: string;
                        provider: string;
                        provider_metadata?: any;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        related: any;
                    };
                    feedbacks?: Array<any>;
                    course_sections?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercises?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            question: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise_options?: Array<{
                                documentId: string;
                                id: number;
                                text: string;
                                explanation: string;
                                isCorrect: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise?: any;
                            }>;
                        }>;
                        lectures?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            completed: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            content?: Array<any>;
                        }>;
                        course?: any;
                    }>;
                    course_categories?: Array<{
                        documentId: string;
                        id: number;
                        name: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                    students?: Array<any>;
                    content_creators?: Array<{
                        documentId: string;
                        id: number;
                        firstName: string;
                        lastName?: string;
                        verifiedAt?: string;
                        biography?: string;
                        email: string;
                        education: 'TODO1' | 'TODO2' | 'TODO3';
                        statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                        courseExperience: string;
                        institution: string;
                        eduStart: string;
                        eduEnd: string;
                        currentCompany: string;
                        currentJobTitle: string;
                        companyStart: string;
                        companyEnd?: string;
                        jobDescription?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                }>;
                certificates?: Array<{
                    documentId: string;
                    id: number;
                    link: string;
                    completionDate: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    student?: any;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                }>;
            };
            course?: {
                documentId: string;
                id: number;
                title: string;
                description?: string;
                difficulty: number;
                numOfRatings: number;
                numOfSubscriptions: number;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                image?: {
                    documentId: string;
                    id: number;
                    name: string;
                    alternativeText?: string;
                    caption?: string;
                    width?: number;
                    height?: number;
                    formats?: any;
                    hash: string;
                    ext?: string;
                    mime: string;
                    size: number;
                    url: string;
                    previewUrl?: string;
                    provider: string;
                    provider_metadata?: any;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    related: any;
                };
                feedbacks?: Array<any>;
                course_sections?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    exercises?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        question: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercise_options?: Array<{
                            documentId: string;
                            id: number;
                            text: string;
                            explanation: string;
                            isCorrect: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise?: any;
                        }>;
                    }>;
                    lectures?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        completed: boolean;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        content?: Array<any>;
                    }>;
                    course?: any;
                }>;
                course_categories?: Array<{
                    documentId: string;
                    id: number;
                    name: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
                students?: Array<any>;
                content_creators?: Array<{
                    documentId: string;
                    id: number;
                    firstName: string;
                    lastName?: string;
                    verifiedAt?: string;
                    biography?: string;
                    email: string;
                    education: 'TODO1' | 'TODO2' | 'TODO3';
                    statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                    courseExperience: string;
                    institution: string;
                    eduStart: string;
                    eduEnd: string;
                    currentCompany: string;
                    currentJobTitle: string;
                    companyStart: string;
                    companyEnd?: string;
                    jobDescription?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
            };
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/certificates',
            query: {
                'fields': fields,
                'filters': filters,
                '_q': q,
                'pagination': pagination,
                'sort': sort,
                'populate': populate,
                'status': status,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param fields
     * @param populate
     * @param status
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static certificatePostCertificates(
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                link: string;
                completionDate: string;
                publishedAt: string;
                student?: string;
                course?: string;
            };
        },
    ): CancelablePromise<{
        data: {
            documentId: string;
            id: number;
            link: string;
            completionDate: string;
            createdAt?: string;
            updatedAt?: string;
            publishedAt: string;
            student?: {
                documentId: string;
                id: number;
                name: string;
                biography?: string;
                email: string;
                isVerified: boolean;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                feedbacks?: Array<{
                    documentId: string;
                    id: number;
                    rating: number;
                    feedbackText?: string;
                    dateCreated: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                    student?: any;
                }>;
                courses?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    difficulty: number;
                    numOfRatings: number;
                    numOfSubscriptions: number;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    image?: {
                        documentId: string;
                        id: number;
                        name: string;
                        alternativeText?: string;
                        caption?: string;
                        width?: number;
                        height?: number;
                        formats?: any;
                        hash: string;
                        ext?: string;
                        mime: string;
                        size: number;
                        url: string;
                        previewUrl?: string;
                        provider: string;
                        provider_metadata?: any;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        related: any;
                    };
                    feedbacks?: Array<any>;
                    course_sections?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercises?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            question: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise_options?: Array<{
                                documentId: string;
                                id: number;
                                text: string;
                                explanation: string;
                                isCorrect: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise?: any;
                            }>;
                        }>;
                        lectures?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            completed: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            content?: Array<any>;
                        }>;
                        course?: any;
                    }>;
                    course_categories?: Array<{
                        documentId: string;
                        id: number;
                        name: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                    students?: Array<any>;
                    content_creators?: Array<{
                        documentId: string;
                        id: number;
                        firstName: string;
                        lastName?: string;
                        verifiedAt?: string;
                        biography?: string;
                        email: string;
                        education: 'TODO1' | 'TODO2' | 'TODO3';
                        statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                        courseExperience: string;
                        institution: string;
                        eduStart: string;
                        eduEnd: string;
                        currentCompany: string;
                        currentJobTitle: string;
                        companyStart: string;
                        companyEnd?: string;
                        jobDescription?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                }>;
                certificates?: Array<{
                    documentId: string;
                    id: number;
                    link: string;
                    completionDate: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    student?: any;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                }>;
            };
            course?: {
                documentId: string;
                id: number;
                title: string;
                description?: string;
                difficulty: number;
                numOfRatings: number;
                numOfSubscriptions: number;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                image?: {
                    documentId: string;
                    id: number;
                    name: string;
                    alternativeText?: string;
                    caption?: string;
                    width?: number;
                    height?: number;
                    formats?: any;
                    hash: string;
                    ext?: string;
                    mime: string;
                    size: number;
                    url: string;
                    previewUrl?: string;
                    provider: string;
                    provider_metadata?: any;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    related: any;
                };
                feedbacks?: Array<any>;
                course_sections?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    exercises?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        question: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercise_options?: Array<{
                            documentId: string;
                            id: number;
                            text: string;
                            explanation: string;
                            isCorrect: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise?: any;
                        }>;
                    }>;
                    lectures?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        completed: boolean;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        content?: Array<any>;
                    }>;
                    course?: any;
                }>;
                course_categories?: Array<{
                    documentId: string;
                    id: number;
                    name: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
                students?: Array<any>;
                content_creators?: Array<{
                    documentId: string;
                    id: number;
                    firstName: string;
                    lastName?: string;
                    verifiedAt?: string;
                    biography?: string;
                    email: string;
                    education: 'TODO1' | 'TODO2' | 'TODO3';
                    statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                    courseExperience: string;
                    institution: string;
                    eduStart: string;
                    eduEnd: string;
                    currentCompany: string;
                    currentJobTitle: string;
                    companyStart: string;
                    companyEnd?: string;
                    jobDescription?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/certificates',
            query: {
                'fields': fields,
                'populate': populate,
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param id
     * @param fields
     * @param populate
     * @param filters
     * @param sort
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static certificateGetCertificatesById(
        id: string,
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        filters?: Record<string, any>,
        sort?: ('link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: {
            documentId: string;
            id: number;
            link: string;
            completionDate: string;
            createdAt?: string;
            updatedAt?: string;
            publishedAt: string;
            student?: {
                documentId: string;
                id: number;
                name: string;
                biography?: string;
                email: string;
                isVerified: boolean;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                feedbacks?: Array<{
                    documentId: string;
                    id: number;
                    rating: number;
                    feedbackText?: string;
                    dateCreated: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                    student?: any;
                }>;
                courses?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    difficulty: number;
                    numOfRatings: number;
                    numOfSubscriptions: number;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    image?: {
                        documentId: string;
                        id: number;
                        name: string;
                        alternativeText?: string;
                        caption?: string;
                        width?: number;
                        height?: number;
                        formats?: any;
                        hash: string;
                        ext?: string;
                        mime: string;
                        size: number;
                        url: string;
                        previewUrl?: string;
                        provider: string;
                        provider_metadata?: any;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        related: any;
                    };
                    feedbacks?: Array<any>;
                    course_sections?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercises?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            question: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise_options?: Array<{
                                documentId: string;
                                id: number;
                                text: string;
                                explanation: string;
                                isCorrect: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise?: any;
                            }>;
                        }>;
                        lectures?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            completed: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            content?: Array<any>;
                        }>;
                        course?: any;
                    }>;
                    course_categories?: Array<{
                        documentId: string;
                        id: number;
                        name: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                    students?: Array<any>;
                    content_creators?: Array<{
                        documentId: string;
                        id: number;
                        firstName: string;
                        lastName?: string;
                        verifiedAt?: string;
                        biography?: string;
                        email: string;
                        education: 'TODO1' | 'TODO2' | 'TODO3';
                        statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                        courseExperience: string;
                        institution: string;
                        eduStart: string;
                        eduEnd: string;
                        currentCompany: string;
                        currentJobTitle: string;
                        companyStart: string;
                        companyEnd?: string;
                        jobDescription?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                }>;
                certificates?: Array<{
                    documentId: string;
                    id: number;
                    link: string;
                    completionDate: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    student?: any;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                }>;
            };
            course?: {
                documentId: string;
                id: number;
                title: string;
                description?: string;
                difficulty: number;
                numOfRatings: number;
                numOfSubscriptions: number;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                image?: {
                    documentId: string;
                    id: number;
                    name: string;
                    alternativeText?: string;
                    caption?: string;
                    width?: number;
                    height?: number;
                    formats?: any;
                    hash: string;
                    ext?: string;
                    mime: string;
                    size: number;
                    url: string;
                    previewUrl?: string;
                    provider: string;
                    provider_metadata?: any;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    related: any;
                };
                feedbacks?: Array<any>;
                course_sections?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    exercises?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        question: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercise_options?: Array<{
                            documentId: string;
                            id: number;
                            text: string;
                            explanation: string;
                            isCorrect: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise?: any;
                        }>;
                    }>;
                    lectures?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        completed: boolean;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        content?: Array<any>;
                    }>;
                    course?: any;
                }>;
                course_categories?: Array<{
                    documentId: string;
                    id: number;
                    name: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
                students?: Array<any>;
                content_creators?: Array<{
                    documentId: string;
                    id: number;
                    firstName: string;
                    lastName?: string;
                    verifiedAt?: string;
                    biography?: string;
                    email: string;
                    education: 'TODO1' | 'TODO2' | 'TODO3';
                    statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                    courseExperience: string;
                    institution: string;
                    eduStart: string;
                    eduEnd: string;
                    currentCompany: string;
                    currentJobTitle: string;
                    companyStart: string;
                    companyEnd?: string;
                    jobDescription?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/certificates/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'filters': filters,
                'sort': sort,
                'status': status,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param id
     * @param fields
     * @param populate
     * @param status
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static certificatePutCertificatesById(
        id: string,
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        status?: 'draft' | 'published',
        requestBody?: {
            data: {
                link?: string;
                completionDate?: string;
                publishedAt?: string;
                student?: string;
                course?: string;
            };
        },
    ): CancelablePromise<{
        data: {
            documentId: string;
            id: number;
            link: string;
            completionDate: string;
            createdAt?: string;
            updatedAt?: string;
            publishedAt: string;
            student?: {
                documentId: string;
                id: number;
                name: string;
                biography?: string;
                email: string;
                isVerified: boolean;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                feedbacks?: Array<{
                    documentId: string;
                    id: number;
                    rating: number;
                    feedbackText?: string;
                    dateCreated: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                    student?: any;
                }>;
                courses?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    difficulty: number;
                    numOfRatings: number;
                    numOfSubscriptions: number;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    image?: {
                        documentId: string;
                        id: number;
                        name: string;
                        alternativeText?: string;
                        caption?: string;
                        width?: number;
                        height?: number;
                        formats?: any;
                        hash: string;
                        ext?: string;
                        mime: string;
                        size: number;
                        url: string;
                        previewUrl?: string;
                        provider: string;
                        provider_metadata?: any;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        related: any;
                    };
                    feedbacks?: Array<any>;
                    course_sections?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercises?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            question: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise_options?: Array<{
                                documentId: string;
                                id: number;
                                text: string;
                                explanation: string;
                                isCorrect: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise?: any;
                            }>;
                        }>;
                        lectures?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            completed: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            content?: Array<any>;
                        }>;
                        course?: any;
                    }>;
                    course_categories?: Array<{
                        documentId: string;
                        id: number;
                        name: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                    students?: Array<any>;
                    content_creators?: Array<{
                        documentId: string;
                        id: number;
                        firstName: string;
                        lastName?: string;
                        verifiedAt?: string;
                        biography?: string;
                        email: string;
                        education: 'TODO1' | 'TODO2' | 'TODO3';
                        statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                        courseExperience: string;
                        institution: string;
                        eduStart: string;
                        eduEnd: string;
                        currentCompany: string;
                        currentJobTitle: string;
                        companyStart: string;
                        companyEnd?: string;
                        jobDescription?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                }>;
                certificates?: Array<{
                    documentId: string;
                    id: number;
                    link: string;
                    completionDate: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    student?: any;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                }>;
            };
            course?: {
                documentId: string;
                id: number;
                title: string;
                description?: string;
                difficulty: number;
                numOfRatings: number;
                numOfSubscriptions: number;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                image?: {
                    documentId: string;
                    id: number;
                    name: string;
                    alternativeText?: string;
                    caption?: string;
                    width?: number;
                    height?: number;
                    formats?: any;
                    hash: string;
                    ext?: string;
                    mime: string;
                    size: number;
                    url: string;
                    previewUrl?: string;
                    provider: string;
                    provider_metadata?: any;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    related: any;
                };
                feedbacks?: Array<any>;
                course_sections?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    exercises?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        question: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercise_options?: Array<{
                            documentId: string;
                            id: number;
                            text: string;
                            explanation: string;
                            isCorrect: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise?: any;
                        }>;
                    }>;
                    lectures?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        completed: boolean;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        content?: Array<any>;
                    }>;
                    course?: any;
                }>;
                course_categories?: Array<{
                    documentId: string;
                    id: number;
                    name: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
                students?: Array<any>;
                content_creators?: Array<{
                    documentId: string;
                    id: number;
                    firstName: string;
                    lastName?: string;
                    verifiedAt?: string;
                    biography?: string;
                    email: string;
                    education: 'TODO1' | 'TODO2' | 'TODO3';
                    statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                    courseExperience: string;
                    institution: string;
                    eduStart: string;
                    eduEnd: string;
                    currentCompany: string;
                    currentJobTitle: string;
                    companyStart: string;
                    companyEnd?: string;
                    jobDescription?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/certificates/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param id
     * @param fields
     * @param populate
     * @param filters
     * @param status
     * @returns any OK
     * @throws ApiError
     */
    public static certificateDeleteCertificatesById(
        id: string,
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<{
        data: {
            documentId: string;
            id: number;
            link: string;
            completionDate: string;
            createdAt?: string;
            updatedAt?: string;
            publishedAt: string;
            student?: {
                documentId: string;
                id: number;
                name: string;
                biography?: string;
                email: string;
                isVerified: boolean;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                feedbacks?: Array<{
                    documentId: string;
                    id: number;
                    rating: number;
                    feedbackText?: string;
                    dateCreated: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                    student?: any;
                }>;
                courses?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    difficulty: number;
                    numOfRatings: number;
                    numOfSubscriptions: number;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    image?: {
                        documentId: string;
                        id: number;
                        name: string;
                        alternativeText?: string;
                        caption?: string;
                        width?: number;
                        height?: number;
                        formats?: any;
                        hash: string;
                        ext?: string;
                        mime: string;
                        size: number;
                        url: string;
                        previewUrl?: string;
                        provider: string;
                        provider_metadata?: any;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        related: any;
                    };
                    feedbacks?: Array<any>;
                    course_sections?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercises?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            question: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise_options?: Array<{
                                documentId: string;
                                id: number;
                                text: string;
                                explanation: string;
                                isCorrect: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise?: any;
                            }>;
                        }>;
                        lectures?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            completed: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            content?: Array<any>;
                        }>;
                        course?: any;
                    }>;
                    course_categories?: Array<{
                        documentId: string;
                        id: number;
                        name: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                    students?: Array<any>;
                    content_creators?: Array<{
                        documentId: string;
                        id: number;
                        firstName: string;
                        lastName?: string;
                        verifiedAt?: string;
                        biography?: string;
                        email: string;
                        education: 'TODO1' | 'TODO2' | 'TODO3';
                        statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                        courseExperience: string;
                        institution: string;
                        eduStart: string;
                        eduEnd: string;
                        currentCompany: string;
                        currentJobTitle: string;
                        companyStart: string;
                        companyEnd?: string;
                        jobDescription?: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        courses?: Array<any>;
                    }>;
                }>;
                certificates?: Array<{
                    documentId: string;
                    id: number;
                    link: string;
                    completionDate: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    student?: any;
                    course?: {
                        documentId: string;
                        id: number;
                        title: string;
                        description?: string;
                        difficulty: number;
                        numOfRatings: number;
                        numOfSubscriptions: number;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        image?: {
                            documentId: string;
                            id: number;
                            name: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash: string;
                            ext?: string;
                            mime: string;
                            size: number;
                            url: string;
                            previewUrl?: string;
                            provider: string;
                            provider_metadata?: any;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            related: any;
                        };
                        feedbacks?: Array<any>;
                        course_sections?: Array<{
                            documentId: string;
                            id: number;
                            title: string;
                            description?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercises?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                question: string;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                exercise_options?: Array<{
                                    documentId: string;
                                    id: number;
                                    text: string;
                                    explanation: string;
                                    isCorrect: boolean;
                                    createdAt?: string;
                                    updatedAt?: string;
                                    publishedAt: string;
                                    exercise?: any;
                                }>;
                            }>;
                            lectures?: Array<{
                                documentId: string;
                                id: number;
                                title: string;
                                completed: boolean;
                                createdAt?: string;
                                updatedAt?: string;
                                publishedAt: string;
                                content?: Array<any>;
                            }>;
                            course?: any;
                        }>;
                        course_categories?: Array<{
                            documentId: string;
                            id: number;
                            name: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                        students?: Array<any>;
                        content_creators?: Array<{
                            documentId: string;
                            id: number;
                            firstName: string;
                            lastName?: string;
                            verifiedAt?: string;
                            biography?: string;
                            email: string;
                            education: 'TODO1' | 'TODO2' | 'TODO3';
                            statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                            courseExperience: string;
                            institution: string;
                            eduStart: string;
                            eduEnd: string;
                            currentCompany: string;
                            currentJobTitle: string;
                            companyStart: string;
                            companyEnd?: string;
                            jobDescription?: string;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            courses?: Array<any>;
                        }>;
                    };
                }>;
            };
            course?: {
                documentId: string;
                id: number;
                title: string;
                description?: string;
                difficulty: number;
                numOfRatings: number;
                numOfSubscriptions: number;
                createdAt?: string;
                updatedAt?: string;
                publishedAt: string;
                image?: {
                    documentId: string;
                    id: number;
                    name: string;
                    alternativeText?: string;
                    caption?: string;
                    width?: number;
                    height?: number;
                    formats?: any;
                    hash: string;
                    ext?: string;
                    mime: string;
                    size: number;
                    url: string;
                    previewUrl?: string;
                    provider: string;
                    provider_metadata?: any;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    related: any;
                };
                feedbacks?: Array<any>;
                course_sections?: Array<{
                    documentId: string;
                    id: number;
                    title: string;
                    description?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    exercises?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        question: string;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        exercise_options?: Array<{
                            documentId: string;
                            id: number;
                            text: string;
                            explanation: string;
                            isCorrect: boolean;
                            createdAt?: string;
                            updatedAt?: string;
                            publishedAt: string;
                            exercise?: any;
                        }>;
                    }>;
                    lectures?: Array<{
                        documentId: string;
                        id: number;
                        title: string;
                        completed: boolean;
                        createdAt?: string;
                        updatedAt?: string;
                        publishedAt: string;
                        content?: Array<any>;
                    }>;
                    course?: any;
                }>;
                course_categories?: Array<{
                    documentId: string;
                    id: number;
                    name: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
                students?: Array<any>;
                content_creators?: Array<{
                    documentId: string;
                    id: number;
                    firstName: string;
                    lastName?: string;
                    verifiedAt?: string;
                    biography?: string;
                    email: string;
                    education: 'TODO1' | 'TODO2' | 'TODO3';
                    statusValue: 'TODO1' | 'TODO2' | 'TODO3';
                    courseExperience: string;
                    institution: string;
                    eduStart: string;
                    eduEnd: string;
                    currentCompany: string;
                    currentJobTitle: string;
                    companyStart: string;
                    companyEnd?: string;
                    jobDescription?: string;
                    createdAt?: string;
                    updatedAt?: string;
                    publishedAt: string;
                    courses?: Array<any>;
                }>;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/certificates/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'filters': filters,
                'status': status,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
}
