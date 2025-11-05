/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VerificationTokenListResponse } from '../models/VerificationTokenListResponse';
import type { VerificationTokenRequest } from '../models/VerificationTokenRequest';
import type { VerificationTokenResponse } from '../models/VerificationTokenResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VerificationTokenService {
    /**
     * @param fields
     * @param filters
     * @param q
     * @param pagination
     * @param sort
     * @param populate
     * @returns VerificationTokenListResponse OK
     * @throws ApiError
     */
    public static verificationTokenGetVerificationTokens(
        fields?: Array<'userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
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
        sort?: ('userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        populate?: (string | Array<string>),
    ): CancelablePromise<VerificationTokenListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/verification-tokens',
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
     * @returns VerificationTokenResponse OK
     * @throws ApiError
     */
    public static verificationTokenPostVerificationTokens(
        requestBody: VerificationTokenRequest,
        fields?: Array<'userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | Array<string>),
    ): CancelablePromise<VerificationTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/verification-tokens',
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
     * @returns VerificationTokenResponse OK
     * @throws ApiError
     */
    public static verificationTokenGetVerificationTokensById(
        id: string,
        fields?: Array<'userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | Array<string>),
        filters?: Record<string, any>,
        sort?: ('userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt' | Array<'userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt'> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
    ): CancelablePromise<VerificationTokenResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/verification-tokens/{id}',
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
     * @returns VerificationTokenResponse OK
     * @throws ApiError
     */
    public static verificationTokenPutVerificationTokensById(
        id: string,
        requestBody: VerificationTokenRequest,
        fields?: Array<'userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | Array<string>),
    ): CancelablePromise<VerificationTokenResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/verification-tokens/{id}',
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
    public static verificationTokenDeleteVerificationTokensById(
        id: string,
        fields?: Array<'userEmail' | 'token' | 'expiresAt' | 'createdAt' | 'updatedAt' | 'publishedAt'>,
        populate?: (string | Array<string>),
        filters?: Record<string, any>,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/verification-tokens/{id}',
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
