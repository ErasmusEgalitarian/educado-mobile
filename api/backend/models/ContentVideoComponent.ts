/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ContentVideoComponent = {
    id?: number;
    __component?: ContentVideoComponent.__component;
    video?: Array<{
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
export namespace ContentVideoComponent {
    export enum __component {
        CONTENT_VIDEO = 'content.video',
    }
}

