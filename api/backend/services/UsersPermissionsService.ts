/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Error } from '../models/Error';
import type { Users_Permissions_Role } from '../models/Users_Permissions_Role';
import type { Users_Permissions_User } from '../models/Users_Permissions_User';
import type { Users_Permissions_UserRegistration } from '../models/Users_Permissions_UserRegistration';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersPermissionsService {
    /**
     * @returns void
     * @throws ApiError
     */
    public static usersPermissionsGetConnect(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connect/(.*)',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Users_Permissions_UserRegistration Connection
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsPostAuthLocal(
        requestBody: {
            identifier?: string;
            password?: string;
        },
    ): CancelablePromise<Users_Permissions_UserRegistration | Error> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/local',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Users_Permissions_UserRegistration Successful registration
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsPostAuthLocalRegister(
        requestBody: {
            username?: string;
            email?: string;
            password?: string;
        },
    ): CancelablePromise<Users_Permissions_UserRegistration | Error> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/local/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param provider
     * @returns Users_Permissions_UserRegistration Returns a jwt token and user info
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsGetAuthByProviderCallback(
        provider: string,
    ): CancelablePromise<Users_Permissions_UserRegistration | Error> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/{provider}/callback',
            path: {
                'provider': provider,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Returns ok
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsPostAuthForgotPassword(
        requestBody: {
            email?: string;
        },
    ): CancelablePromise<{
        ok?: string;
    } | Error> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Users_Permissions_UserRegistration Returns a jwt token and user info
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsPostAuthResetPassword(
        requestBody: {
            password?: string;
            passwordConfirmation?: string;
            code?: string;
        },
    ): CancelablePromise<Users_Permissions_UserRegistration | Error> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsGetAuthEmailConfirmation(): CancelablePromise<Error> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/email-confirmation',
            errors: {
                301: `Redirects to the configure email confirmation redirect url`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any Returns email and boolean to confirm email was sent
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsPostAuthSendEmailConfirmation(
        requestBody: {
            email?: string;
        },
    ): CancelablePromise<{
        email?: string;
        sent?: string;
    } | Error> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/send-email-confirmation',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Users_Permissions_UserRegistration Returns a jwt token and user info
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsPostAuthChangePassword(
        requestBody: {
            password: string;
            currentPassword: string;
            passwordConfirmation: string;
        },
    ): CancelablePromise<Users_Permissions_UserRegistration | Error> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public static usersPermissionsPostAuthRefresh(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public static usersPermissionsPostAuthLogout(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param filters
     * @returns number Returns a number
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsGetUsersCount(
        filters?: Record<string, any>,
    ): CancelablePromise<number | Error> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/count',
            query: {
                'filters': filters,
            },
        });
    }
    /**
     * @param fields
     * @param populate
     * @param sort
     * @param pagination
     * @param filters
     * @returns Users_Permissions_User Returns an array of users
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsGetUsers(
        fields?: (string | Array<string>),
        populate?: (string | Array<string> | Record<string, any>),
        sort?: (string | Array<string> | Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>>),
        pagination?: ({
            withCount?: boolean;
        } & ({
            page: number;
            pageSize: number;
        } | {
            start: number;
            limit: number;
        })),
        filters?: Record<string, any>,
    ): CancelablePromise<Array<Users_Permissions_User> | Error> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users',
            query: {
                'fields': fields,
                'populate': populate,
                'sort': sort,
                'pagination': pagination,
                'filters': filters,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Error Error
     * @returns any Returns created user info
     * @throws ApiError
     */
    public static usersPermissionsPostUsers(
        requestBody: {
            email: string;
            username: string;
            password: string;
        },
    ): CancelablePromise<Error | (Users_Permissions_User & {
        role?: Users_Permissions_Role;
    })> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param fields
     * @param populate
     * @returns Users_Permissions_User Returns user info
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsGetUsersMe(
        fields?: (string | Array<string>),
        populate?: (string | Array<string> | Record<string, any>),
    ): CancelablePromise<Users_Permissions_User | Error> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
            query: {
                'fields': fields,
                'populate': populate,
            },
        });
    }
    /**
     * @param id
     * @param fields
     * @param populate
     * @returns Users_Permissions_User Returns a user
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsGetUsersById(
        id: string,
        fields?: (string | Array<string>),
        populate?: (string | Array<string> | Record<string, any>),
    ): CancelablePromise<Users_Permissions_User | Error> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            query: {
                'fields': fields,
                'populate': populate,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Returns updated user info
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsPutUsersById(
        id: string,
        requestBody: {
            email: string;
            username: string;
            password: string;
        },
    ): CancelablePromise<(Users_Permissions_User & {
        role?: Users_Permissions_Role;
    }) | Error> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Returns deleted user info
     * @returns Error Error
     * @throws ApiError
     */
    public static usersPermissionsDeleteUsersById(
        id: string,
    ): CancelablePromise<Users_Permissions_User | Error> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetRolesById(
        id: string,
    ): CancelablePromise<{
        role: {
            id: number;
            documentId: string;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            nb_users?: number;
            permissions?: Record<string, {
                controllers: Record<string, Record<string, {
                    enabled: boolean;
                    policy: string;
                }>>;
            }>;
            users?: Array<any>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetRoles(): CancelablePromise<{
        roles: Array<{
            id: number;
            documentId: string;
            name: string;
            description: (string | null);
            type: string;
            createdAt: string;
            updatedAt: string;
            publishedAt: string;
            nb_users?: number;
            permissions?: Record<string, {
                controllers: Record<string, Record<string, {
                    enabled: boolean;
                    policy: string;
                }>>;
            }>;
            users?: Array<any>;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/roles',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPostRoles(
        requestBody?: {
            name: string;
            description?: string;
            type: string;
            permissions?: Record<string, any>;
        },
    ): CancelablePromise<{
        ok: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/roles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param role
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsPutRolesByRole(
        role: string,
        requestBody?: {
            name?: string;
            description?: string;
            type?: string;
            permissions?: Record<string, any>;
        },
    ): CancelablePromise<{
        ok: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/roles/{role}',
            path: {
                'role': role,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @param role
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsDeleteRolesByRole(
        role: string,
    ): CancelablePromise<{
        ok: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/roles/{role}',
            path: {
                'role': role,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static usersPermissionsGetPermissions(): CancelablePromise<{
        permissions: Record<string, {
            controllers: Record<string, Record<string, {
                enabled: boolean;
                policy: string;
            }>>;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/permissions',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
}
