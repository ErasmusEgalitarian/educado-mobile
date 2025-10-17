import axios, { isAxiosError } from "axios";
import * as FileSystem from "expo-file-system";
import { StudentInfo } from "@/types/student";
import { Component } from "@/types/component";

const url = process.env.EXPO_PUBLIC_BACK_END_HOST;

/**
 * This is the client that will be used to make requests to the backend.
 */
export const client = axios.create({
  baseURL: url,
  withCredentials: true,
  responseType: "json",
  timeout: 30000,
});

/**
 * Sends a request to the backend to register a new user.
 * @param {Object} obj Should contain the following properties:
 * - firstName
 * - lastName
 * - email
 * - password
 */
export const registerUser = async (obj: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}) => {
  console.log(`User trying to register:
    firstName: ${obj.firstName ?? "undefined"}
    lastName: ${obj.lastName ?? "undefined"}
    email: ${obj.email ?? "undefined"}`);

  try {
    const res = await client.post("/api/auth/signup", obj);
    console.log("User successfully registered");
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

/**
 * Sends a request to the backend to log in an existing user.
 * @param {Object} obj should contain the following properties:
 * - email
 * - password
 */
export const loginUser = async (obj: { email: string; password: string }) => {
  try {
    const res = await client.post("/api/auth/login", obj);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const deleteUser = async (userId: string, token: string | null) => {
  try {
    const res = await client.delete(`/api/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        token: token, // Include the token in the headers
      },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const updateUserFields = async (
  userId: string,
  obj: { email?: string; firstName?: string; lastName?: string },
  token: string | null,
) => {
  try {
    const res = await client.patch(`/api/users/${userId}`, obj, {
      headers: {
        "Content-Type": "application/json",
        token: token, // Include the token in the headers
      },
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const updateUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
  token: string | null,
) => {
  try {
    const res = await axios.patch(
      `${url}/api/users/${userId}/password`,
      {
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: token, // Include the token in the headers
        },
      },
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const completeComponent = async (
  userId: string,
  comp: Component,
  isComplete: boolean,
  points: number,
  token: string | null,
) => {
  try {
    const res = await client.patch(
      `/api/students/${userId}/complete`,
      { comp: comp, isComplete: isComplete, points: points },
      {
        headers: {
          "Content-Type": "application/json",
          token: token, // Include the token in the headers
        },
      },
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const getStudentInfo = async (
  userId: string | null | undefined,
): Promise<StudentInfo> => {
  try {
    const res = await client.get(`/api/students/${userId}/info`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const addCourseToStudent = async (
  userId: string | null,
  courseId: string,
  token: string | null,
) => {
  try {
    const res = await client.patch(
      `/api/students/${userId}/courses/${courseId}/enroll`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          token: token, // Include the token in the headers
        },
      },
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const uploadPhoto = async (
  userId: string,
  photo: string,
  token: string | null,
) => {
  try {
    const formData = new FormData();

    const file = await FileSystem.getInfoAsync(photo);

    if (!file.exists) {
      throw new Error("File does not exist");
    }

    formData.append("file", {
      uri: file.uri, // The URI from expo-file-system
      type: "image/jpeg", // You can adjust this to the actual file type
      name: "photo.jpg", // File name
    } as unknown as Blob);

    const res = await client.put(`/api/students/${userId}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
        token: token,
      },
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const deletePhoto = async (
  userId: string | null,
  token: string | null,
) => {
  try {
    const res = await client.delete(`/api/students/${userId}/photo`, {
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

/**
 * Function to send mail to user with code to reset password
 * @param {Object} email should contain an email, to receive a reset password message
 */
export const sendResetPasswordEmail = async (email: { email: string }) => {
  try {
    const res = await client.post("/api/auth/reset-password-request", email);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

/**
 * function to validate the code sent to the user
 * @param {Object} obj should contain the following properties:
 * - email
 * - token
 */
export const validateResetPasswordCode = async (obj: {
  email: string;
  token: string;
}) => {
  try {
    const res = await client.post("/api/auth/reset-password-code", obj);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

/**
 * When user enters a new password it should update the password of the user
 * @param {Object} obj should contain the following properties:
 * - email
 * - token
 * - newPassword
 */
export const enterNewPassword = async (obj: {
  email: string;
  token: string;
  newPassword: string;
}) => {
  try {
    const res = await client.patch("/api/auth/reset-password", obj);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

/**
 * Update student study streak
 */
export const updateStudyStreak = async (studentId: string) => {
  try {
    const res = await client.patch(
      `/api/students/${studentId}/updateStudyStreak`,
    );
    return res.status;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(`Error Message: ${error.message}`);
      console.error(`Error Code: ${error.code}`);

      throw error;
    } else {
      throw error;
    }
  }
};
