/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentDescriptionComponent } from './ContentDescriptionComponent';
import type { ContentVideoComponent } from './ContentVideoComponent';
export type Lecture = {
    id?: number;
    documentId?: string;
    title: string;
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
};

