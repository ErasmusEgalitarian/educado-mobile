import { client } from "@/api/backend/client.gen";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_TOKEN_KEY = "auth_token";

/**
 * Gets the auth token from AsyncStorage.
 * @returns The access token if available, null otherwise
 */
const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

/**
 * Sets the auth token in AsyncStorage.
 * @param token - The token to store, or null to remove it
 */
export const setAuthToken = async (token: string | null): Promise<void> => {
  if (token) {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getBaseApiUrl = (): string => {
  const strapiUrl = process.env.EXPO_PUBLIC_STRAPI_BACKEND;
  return strapiUrl ?? "http://localhost:1337";
};

/**
 * Configures the API client with base URL and authentication token from environment variables.
 * @throws {Error} When STRAPI_TOKEN is not set in environment variables
 */
export const configureApiClient = async () => {
  const baseUrl = getBaseApiUrl();

  // Configure the client with base URL and authorization header
  client.setConfig({
    baseUrl,
    throwOnError: true,
  });

  // Request interceptor to add auth token and logging
  client.interceptors.request.use(async (request) => {
    // Get token from AsyncStorage
    const token = await getAuthToken();

    // Add Authorization header if token is available
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

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

    // Handle 401/403 errors - token might be invalid
    if (response.status === 401 || response.status === 403) {
      if (__DEV__) {
        const status = String(response.status);
        console.log(
          `Response 📥 ${response.url} [${status}] - Auth failed`,
        );
      }
      // Note: Error will propagate and components can handle logout if needed
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
