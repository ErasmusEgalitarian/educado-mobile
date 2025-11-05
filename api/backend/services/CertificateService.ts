/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CertificateListResponse } from '../models/CertificateListResponse';
import type { CertificateRequest } from '../models/CertificateRequest';
import type { CertificateResponse } from '../models/CertificateResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CertificateService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @param status
     * @returns CertificateListResponse OK
     * @throws ApiError
     */
    public static certificateGetCertificates(
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CertificateListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/certificates',
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
     * @returns CertificateResponse OK
     * @throws ApiError
     */
    public static certificatePostCertificates(
        requestBody: CertificateRequest,
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CertificateResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/certificates',
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
     * @returns CertificateResponse OK
     * @throws ApiError
     */
    public static certificateGetCertificatesById(
        id: string,
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        filters?: Record<string, any>,
        sort?: ('link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CertificateResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/certificates/{id}',
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
     * @returns CertificateResponse OK
     * @throws ApiError
     */
    public static certificatePutCertificatesById(
        id: string,
        requestBody: CertificateRequest,
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        status?: 'draft' | 'published',
    ): CancelablePromise<CertificateResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/certificates/{id}',
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
    public static certificateDeleteCertificatesById(
        id: string,
        fields?: Array<'link' | 'completionDate' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | 'student' | 'course' | Array<'student' | 'course'>),
        filters?: Record<string, any>,
        status?: 'draft' | 'published',
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/certificates/{id}',
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
