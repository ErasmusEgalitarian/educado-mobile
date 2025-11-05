/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeedbackListResponse } from '../models/FeedbackListResponse';
import type { FeedbackRequest } from '../models/FeedbackRequest';
import type { FeedbackResponse } from '../models/FeedbackResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FeedbackService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns FeedbackListResponse OK
     * @throws ApiError
     */
    public static feedbackGetFeedbacks(
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<FeedbackListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feedbacks',
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
     * @returns FeedbackResponse OK
     * @throws ApiError
     */
    public static feedbackPostFeedbacks(
        requestBody: FeedbackRequest,
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<FeedbackResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/feedbacks',
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
     * @returns FeedbackResponse OK
     * @throws ApiError
     */
    public static feedbackGetFeedbacksById(
        id: string,
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        filters?: Record<string, any>,
        sort?: ('rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<FeedbackResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/feedbacks/{id}',
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
     * @returns FeedbackResponse OK
     * @throws ApiError
     */
    public static feedbackPutFeedbacksById(
        id: string,
        requestBody: FeedbackRequest,
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<FeedbackResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/feedbacks/{id}',
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
    public static feedbackDeleteFeedbacksById(
        id: string,
        fields?: Array<'rating' | 'feedbackText' | 'dateCreated' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'course' | 'student' | Array<'course' | 'student'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/feedbacks/{id}',
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
