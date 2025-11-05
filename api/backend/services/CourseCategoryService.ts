/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseCategoryListResponse } from '../models/CourseCategoryListResponse';
import type { CourseCategoryRequest } from '../models/CourseCategoryRequest';
import type { CourseCategoryResponse } from '../models/CourseCategoryResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseCategoryService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns CourseCategoryListResponse OK
     * @throws ApiError
     */
    public static courseCategoryGetCourseCategories(
        fields?: Array<'name' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('name' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'name' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'courses' | Array<'courses'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseCategoryListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-categories',
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
     * @returns CourseCategoryResponse OK
     * @throws ApiError
     */
    public static courseCategoryPostCourseCategories(
        requestBody: CourseCategoryRequest,
        fields?: Array<'name' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseCategoryResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/course-categories',
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
     * @returns CourseCategoryResponse OK
     * @throws ApiError
     */
    public static courseCategoryGetCourseCategoriesById(
        id: string,
        fields?: Array<'name' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
        filters?: Record<string, any>,
        sort?: ('name' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'name' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseCategoryResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/course-categories/{id}',
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
     * @returns CourseCategoryResponse OK
     * @throws ApiError
     */
    public static courseCategoryPutCourseCategoriesById(
        id: string,
        requestBody: CourseCategoryRequest,
        fields?: Array<'name' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseCategoryResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/course-categories/{id}',
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
    public static courseCategoryDeleteCourseCategoriesById(
        id: string,
        fields?: Array<'name' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'courses' | Array<'courses'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/course-categories/{id}',
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
