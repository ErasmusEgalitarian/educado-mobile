/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JWTResponse } from '../models/JWTResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { OKResponse } from '../models/OKResponse';
import type { ResetPasswordCodeRequest } from '../models/ResetPasswordCodeRequest';
import type { ResetPasswordRequest } from '../models/ResetPasswordRequest';
import type { ResetPasswordRequestRequest } from '../models/ResetPasswordRequestRequest';
import type { SignupRequest } from '../models/SignupRequest';
import type { StudentVerificationTokenRequest } from '../models/StudentVerificationTokenRequest';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { VerifyEmailRequest } from '../models/VerifyEmailRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StudentAuthService {
    /**
     * @param requestBody
     * @returns JWTResponse OK
     * @throws ApiError
     */
    public static postStudentLogin(
        requestBody: LoginRequest,
    ): CancelablePromise<JWTResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/student/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns SuccessResponse OK
     * @throws ApiError
     */
    public static postStudentResetPasswordRequest(
        requestBody: ResetPasswordRequestRequest,
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/student/reset-password-request',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns SuccessResponse OK
     * @throws ApiError
     */
    public static postStudentResetPasswordCode(
        requestBody: ResetPasswordCodeRequest,
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/student/reset-password-code',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns SuccessResponse OK
     * @throws ApiError
     */
    public static patchStudentResetPasswordUpdate(
        requestBody: ResetPasswordRequest,
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/student/reset-password-update',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns JWTResponse OK
     * @throws ApiError
     */
    public static postStudentSignup(
        requestBody: SignupRequest,
    ): CancelablePromise<JWTResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/student/signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns OKResponse OK
     * @throws ApiError
     */
    public static postStudentSendVerificationToken(
        requestBody: StudentVerificationTokenRequest,
    ): CancelablePromise<OKResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/student/send-verification-token',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns JWTResponse OK
     * @throws ApiError
     */
    public static postStudentVerifyEmail(
        requestBody: VerifyEmailRequest,
    ): CancelablePromise<JWTResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/student/verify-email',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
