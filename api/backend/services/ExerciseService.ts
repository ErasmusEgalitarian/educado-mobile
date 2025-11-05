/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExerciseListResponse } from '../models/ExerciseListResponse';
import type { ExerciseRequest } from '../models/ExerciseRequest';
import type { ExerciseResponse } from '../models/ExerciseResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExerciseService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns ExerciseListResponse OK
     * @throws ApiError
     */
    public static exerciseGetExercises(
        fields?: Array<'title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'exercise_options' | Array<'exercise_options'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ExerciseListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/exercises',
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
     * @returns ExerciseResponse OK
     * @throws ApiError
     */
    public static exercisePostExercises(
        requestBody: ExerciseRequest,
        fields?: Array<'title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise_options' | Array<'exercise_options'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ExerciseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/exercises',
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
     * @returns ExerciseResponse OK
     * @throws ApiError
     */
    public static exerciseGetExercisesById(
        id: string,
        fields?: Array<'title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise_options' | Array<'exercise_options'>),
        filters?: Record<string, any>,
        sort?: ('title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ExerciseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/exercises/{id}',
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
     * @returns ExerciseResponse OK
     * @throws ApiError
     */
    public static exercisePutExercisesById(
        id: string,
        requestBody: ExerciseRequest,
        fields?: Array<'title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise_options' | Array<'exercise_options'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<ExerciseResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/exercises/{id}',
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
    public static exerciseDeleteExercisesById(
        id: string,
        fields?: Array<'title' | 'question' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'exercise_options' | Array<'exercise_options'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/exercises/{id}',
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
