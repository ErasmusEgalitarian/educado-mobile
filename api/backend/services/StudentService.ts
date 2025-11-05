/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StudentListResponse } from '../models/StudentListResponse';
import type { StudentRequest } from '../models/StudentRequest';
import type { StudentResponse } from '../models/StudentResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns StudentListResponse OK
     * @throws ApiError
     */
    public static studentGetStudents(
        fields?: Array<'name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'feedbacks' | 'courses' | 'certificates' | 'user_logs' | Array<'feedbacks' | 'courses' | 'certificates' | 'user_logs'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<StudentListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students',
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
     * @returns StudentResponse OK
     * @throws ApiError
     */
    public static studentPostStudents(
        requestBody: StudentRequest,
        fields?: Array<'name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | 'certificates' | 'user_logs' | Array<'feedbacks' | 'courses' | 'certificates' | 'user_logs'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/students',
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
     * @returns StudentResponse OK
     * @throws ApiError
     */
    public static studentGetStudentsById(
        id: string,
        fields?: Array<'name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | 'certificates' | 'user_logs' | Array<'feedbacks' | 'courses' | 'certificates' | 'user_logs'>),
        filters?: Record<string, any>,
        sort?: ('name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/students/{id}',
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
     * @returns StudentResponse OK
     * @throws ApiError
     */
    public static studentPutStudentsById(
        id: string,
        requestBody: StudentRequest,
        fields?: Array<'name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | 'certificates' | 'user_logs' | Array<'feedbacks' | 'courses' | 'certificates' | 'user_logs'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<StudentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/students/{id}',
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
    public static studentDeleteStudentsById(
        id: string,
        fields?: Array<'name' | 'biography' | 'email' | 'password' | 'verifiedAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'feedbacks' | 'courses' | 'certificates' | 'user_logs' | Array<'feedbacks' | 'courses' | 'certificates' | 'user_logs'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/students/{id}',
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
