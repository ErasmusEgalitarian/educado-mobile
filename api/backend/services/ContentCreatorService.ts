/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentCreatorListResponse } from '../models/ContentCreatorListResponse';
import type { ContentCreatorRequest } from '../models/ContentCreatorRequest';
import type { ContentCreatorResponse } from '../models/ContentCreatorResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentCreatorService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns ContentCreatorListResponse OK
     * @throws ApiError
     */
    public static contentCreatorGetContentCreators(
        fields?: Array<'firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'courses' | 'user_logs' | Array<'courses' | 'user_logs'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ContentCreatorListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-creators',
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
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param requestBody
     * @param fields
     * @param populate
     * @param status
     * @returns ContentCreatorResponse OK
     * @throws ApiError
     */
    public static contentCreatorPostContentCreators(
        requestBody: ContentCreatorRequest,
        fields?: Array<'firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | 'user_logs' | Array<'courses' | 'user_logs'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ContentCreatorResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content-creators',
            query: {
                'fields': fields,
                'populate': populate,
                'status': status,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
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
     * @returns ContentCreatorResponse OK
     * @throws ApiError
     */
    public static contentCreatorGetContentCreatorsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | 'user_logs' | Array<'courses' | 'user_logs'>),
        filters?: Record<string, any>,
        sort?: ('firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ContentCreatorResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content-creators/{id}',
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
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @param fields
     * @param populate
     * @param status
     * @returns ContentCreatorResponse OK
     * @throws ApiError
     */
    public static contentCreatorPutContentCreatorsById(
        id: string,
        requestBody: ContentCreatorRequest,
        fields?: Array<'firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | 'user_logs' | Array<'courses' | 'user_logs'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ContentCreatorResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/content-creators/{id}',
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
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * @param id
     * @param fields
     * @param populate
     * @param filters
     * @param status
     * @returns number OK
     * @throws ApiError
     */
    public static contentCreatorDeleteContentCreatorsById(
        id: string,
        fields?: Array<'firstName' | 'lastName' | 'verifiedAt' | 'biography' | 'email' | 'password' | 'education' | 'statusValue' | 'courseExperience' | 'institution' | 'eduStart' | 'eduEnd' | 'currentCompany' | 'currentJobTitle' | 'companyStart' | 'companyEnd' | 'jobDescription' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | 'user_logs' | Array<'courses' | 'user_logs'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/content-creators/{id}',
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
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
