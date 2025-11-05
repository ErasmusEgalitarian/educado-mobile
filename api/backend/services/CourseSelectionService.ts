/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseSelectionListResponse } from '../models/CourseSelectionListResponse';
import type { CourseSelectionRequest } from '../models/CourseSelectionRequest';
import type { CourseSelectionResponse } from '../models/CourseSelectionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseSelectionService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns CourseSelectionListResponse OK
     * @throws ApiError
     */
    public static courseSelectionGetCourseSelections(
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseSelectionListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-selections',
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
     * @returns CourseSelectionResponse OK
     * @throws ApiError
     */
    public static courseSelectionPostCourseSelections(
        requestBody: CourseSelectionRequest,
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseSelectionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/course-selections',
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
     * @returns CourseSelectionResponse OK
     * @throws ApiError
     */
    public static courseSelectionGetCourseSelectionsById(
        id: string,
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        filters?: Record<string, any>,
        sort?: ('title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseSelectionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-selections/{id}',
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
     * @returns CourseSelectionResponse OK
     * @throws ApiError
     */
    public static courseSelectionPutCourseSelectionsById(
        id: string,
        requestBody: CourseSelectionRequest,
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseSelectionResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/course-selections/{id}',
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
    public static courseSelectionDeleteCourseSelectionsById(
        id: string,
        fields?: Array<'title' | 'description' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercises' | 'lectures' | 'course' | Array<'exercises' | 'lectures' | 'course'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/course-selections/{id}',
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
