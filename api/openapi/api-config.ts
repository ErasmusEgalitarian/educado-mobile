import { client } from "@/api/backend/client.gen";
import Constants from "expo-constants";

export const getBaseApiUrl = (): string => {
  const strapiUrl = process.env.EXPO_PUBLIC_STRAPI_BACKEND;
  return strapiUrl ?? "http://localhost:1337";
};

/**
 * Configures the API client with base URL and authentication token from environment variables.
 * @throws {Error} When STRAPI_TOKEN is not set in environment variables
 */
export const configureApiClient = () => {
  const baseUrl = getBaseApiUrl();

  // Configure the client with base URL and authorization header
  client.setConfig({
    baseUrl,
    throwOnError: true,
  });

  // Request interceptor for logging in development
  client.interceptors.request.use((request) => {
    if (__DEV__) {
      console.log(`Request 📤 ${request.method} ${request.url}`);
    }
    return request;
  });

  // Response interceptor for logging
  client.interceptors.response.use((response) => {
    if (__DEV__) {
      console.log(`Response 📥 ${response.url}`, { status: response.status });
    }
    return response;
  });

  console.log("API Client configured:", {
    baseUrl,
  });
};

/**
 * Generates headers for API requests, including Authorization if token is set.
 * Used when making fetch calls outside the generated API client.
 * @returns {Record<string, string>} Headers object for fetch requests
 */
export const fetchHeaders = (): Record<string, string> => {
  const apiToken = Constants.expoConfig?.extra?.STRAPI_TOKEN as
    | string
    | undefined;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiToken !== undefined && apiToken !== "") {
    headers.Authorization = `Bearer ${apiToken}`;
  }

  return headers;
};
