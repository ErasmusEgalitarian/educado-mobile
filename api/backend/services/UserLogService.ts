/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserLogListResponse } from '../models/UserLogListResponse';
import type { UserLogRequest } from '../models/UserLogRequest';
import type { UserLogResponse } from '../models/UserLogResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserLogService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @returns UserLogListResponse OK
     * @throws ApiError
     */
    public static userLogGetUserLogs(
        fields?: Array<'loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'student' | Array<'student'>),
    ): CancelablePromise<UserLogListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user-logs',
            query: {
                'fields': fields,
                'filters': filters,
                '_q': q,
                'pagination': pagination,
                'sort': sort,
                'populate': populate,
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
     * @returns UserLogResponse OK
     * @throws ApiError
     */
    public static userLogPostUserLogs(
        requestBody: UserLogRequest,
        fields?: Array<'loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | Array<'student'>),
    ): CancelablePromise<UserLogResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user-logs',
            query: {
                'fields': fields,
                'populate': populate,
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
     * @returns UserLogResponse OK
     * @throws ApiError
     */
    public static userLogGetUserLogsById(
        id: string,
        fields?: Array<'loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | Array<'student'>),
        filters?: Record<string, any>,
        sort?: ('loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
    ): CancelablePromise<UserLogResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user-logs/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'filters': filters,
                'sort': sort,
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
     * @returns UserLogResponse OK
     * @throws ApiError
     */
    public static userLogPutUserLogsById(
        id: string,
        requestBody: UserLogRequest,
        fields?: Array<'loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | Array<'student'>),
    ): CancelablePromise<UserLogResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/user-logs/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
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
     * @returns number OK
     * @throws ApiError
     */
    public static userLogDeleteUserLogsById(
        id: string,
        fields?: Array<'loginDate' | 'isSuccessful' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | Array<'student'>),
        filters?: Record<string, any>,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user-logs/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
                'filters': filters,
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
