/* eslint-disable eqeqeq */


import { OpenAPI } from "@/api/backend/core/OpenAPI";
import Constants from "expo-constants";

/**
 * Configures the API client with base URL and authentication token from environment variables.
 * @throws {Error} When VITE_STRAPI_API_TOKEN is not set in environment variables
 */
const configureApiClient = () => {
  // Set the base URL from environment variable
  const strapiUrl = process.env.EXPO_PUBLIC_STRAPI_BACKEND;
  OpenAPI.BASE = strapiUrl ?? "http://localhost:1337";

  // Set the API token if available
  const apiToken = Constants.expoConfig?.extra?.STRAPI_TOKEN as string | undefined;
  if (apiToken != undefined) {
    OpenAPI.TOKEN = apiToken;
  } else {
    console.error(
      "Warning: VITE_STRAPI_API_TOKEN is not set in environment variables. API requests may fail.",
    );
    throw new Error(
      "VITE_STRAPI_API_TOKEN is not set in environment variables",
    );
  }


  console.log("API Client configured:", {
    baseUrl: OpenAPI.BASE,
    hasToken: OpenAPI.TOKEN !== "",
  });
};

/**
 * Generates headers for API requests, including Authorization if token is set.
 * Used when making fetch calls outside the generated API client.
 * @returns {Record<string, string>} Headers object for fetch requests
 */
export const fetchHeaders = () => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (OpenAPI.TOKEN !== undefined && OpenAPI.TOKEN !== "") {
    headers.Authorization = `Bearer ${String(OpenAPI.TOKEN)}`;
  }
  return headers;
};

export default configureApiClient;
