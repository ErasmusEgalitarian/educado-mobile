/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseListResponse } from '../models/CourseListResponse';
import type { CourseRequest } from '../models/CourseRequest';
import type { CourseResponse } from '../models/CourseResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns CourseListResponse OK
     * @throws ApiError
     */
    public static courseGetCourses(
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses',
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
     * @returns CourseResponse OK
     * @throws ApiError
     */
    public static coursePostCourses(
        requestBody: CourseRequest,
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/courses',
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
     * @returns CourseResponse OK
     * @throws ApiError
     */
    public static courseGetCoursesById(
        id: string,
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators'>),
        filters?: Record<string, any>,
        sort?: ('title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/courses/{id}',
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
     * @returns CourseResponse OK
     * @throws ApiError
     */
    public static coursePutCoursesById(
        id: string,
        requestBody: CourseRequest,
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CourseResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/courses/{id}',
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
    public static courseDeleteCoursesById(
        id: string,
        fields?: Array<'title' | 'description' | 'difficulty' | 'numOfRatings' | 'numOfSubscriptions' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators' | Array<'image' | 'feedbacks' | 'course_sections' | 'course_categories' | 'students' | 'content_creators'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/courses/{id}',
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
