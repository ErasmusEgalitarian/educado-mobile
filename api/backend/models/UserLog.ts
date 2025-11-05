/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentDescriptionComponent } from './ContentDescriptionComponent';
import type { ContentVideoComponent } from './ContentVideoComponent';
export type UserLog = {
    id?: number;
    documentId?: string;
    loginDate: string;
    isSuccessful: boolean;
    student?: {
        id?: number;
        documentId?: string;
        name?: string;
        biography?: string;
        email?: string;
        verifiedAt?: string;
        feedbacks?: Array<{
            id?: number;
            documentId?: string;
            rating?: number;
            feedbackText?: string;
            dateCreated?: string;
            course?: {
                id?: number;
                documentId?: string;
                title?: string;
                description?: string;
                difficulty?: number;
                numOfRatings?: number;
                numOfSubscriptions?: number;
                image?: {
                    id?: number;
                    documentId?: string;
                    name?: string;
                    alternativeText?: string;
                    caption?: string;
                    width?: number;
                    height?: number;
                    formats?: any;
                    hash?: string;
                    ext?: string;
                    mime?: string;
                    size?: number;
                    url?: string;
                    previewUrl?: string;
                    provider?: string;
                    provider_metadata?: any;
                    related?: Array<{
                        id?: number;
                        documentId?: string;
                    }>;
                    folder?: {
                        id?: number;
                        documentId?: string;
                        name?: string;
                        pathId?: number;
                        parent?: {
                            id?: number;
                            documentId?: string;
                        };
                        children?: Array<{
                            id?: number;
                            documentId?: string;
                        }>;
                        files?: Array<{
                            id?: number;
                            documentId?: string;
                            name?: string;
                            alternativeText?: string;
                            caption?: string;
                            width?: number;
                            height?: number;
                            formats?: any;
                            hash?: string;
                            ext?: string;
                            mime?: string;
                            size?: number;
                            url?: string;
                            previewUrl?: string;
                            provider?: string;
                            provider_metadata?: any;
                            related?: Array<{
                                id?: number;
                                documentId?: string;
                            }>;
                            folder?: {
                                id?: number;
                                documentId?: string;
                            };
                            folderPath?: string;
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
                        path?: string;
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
                    folderPath?: string;
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
                feedbacks?: Array<{
                    id?: number;
                    documentId?: string;
                }>;
                course_sections?: Array<{
                    id?: number;
                    documentId?: string;
                    title?: string;
                    description?: string;
                    exercises?: Array<{
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
                    lectures?: Array<{
                        id?: number;
                        documentId?: string;
                        title?: string;
                        completed?: boolean;
                        content?: Array<(ContentVideoComponent | ContentDescriptionComponent)>;
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
                    course?: {
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
                course_categories?: Array<{
                    id?: number;
                    documentId?: string;
                    name?: string;
                    courses?: Array<{
                        id?: number;
                        documentId?: string;
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
                students?: Array<{
                    id?: number;
                    documentId?: string;
                }>;
                content_creators?: Array<{
                    id?: number;
                    documentId?: string;
                    firstName?: string;
                    lastName?: string;
                    verifiedAt?: string;
                    biography?: string;
                    email?: string;
                    education?: 'TODO1' | 'TODO2' | 'TODO3';
                    statusValue?: 'TODO1' | 'TODO2' | 'TODO3';
                    courseExperience?: string;
                    institution?: string;
                    eduStart?: string;
                    eduEnd?: string;
                    currentCompany?: string;
                    currentJobTitle?: string;
                    companyStart?: string;
                    companyEnd?: string;
                    jobDescription?: string;
                    courses?: Array<{
                        id?: number;
                        documentId?: string;
                    }>;
                    user_logs?: Array<{
                        id?: number;
                        documentId?: string;
                        loginDate?: string;
                        isSuccessful?: boolean;
                        student?: {
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
            student?: {
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
        courses?: Array<{
            id?: number;
            documentId?: string;
        }>;
        certificates?: Array<{
            id?: number;
            documentId?: string;
            link?: string;
            completionDate?: string;
            student?: {
                id?: number;
                documentId?: string;
            };
            course?: {
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
        user_logs?: Array<{
            id?: number;
            documentId?: string;
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

