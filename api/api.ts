import { backEndClient } from "@/axios";
import { isAxiosError } from "axios";
import { Buffer } from "buffer";
import { Course } from "@/types/course";
import { AudioResponse } from "@/types/ai";
import { t } from "@/i18n";

const timeoutInMs = 1200;

/**
 * Get components for a specific section
 */
export const getComponents = async (sectionId: string) => {
  try {
    const res = await backEndClient.get(
      `/api/courses/sections/${sectionId}/components`,
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

export const getSectionById = async (sectionId: string) => {
  try {
    const res = await backEndClient.get(`/api/sections/${sectionId}`);
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
 * Get a specific course
 */
export const getCourse = async (courseId: string) => {
  try {
    const res = await backEndClient.get(`/api/courses/${courseId}`, {
      timeout: timeoutInMs,
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
 * Get all courses
 */
export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await backEndClient.get("/api/courses");

    return response.data as Course[];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.error ?? t("api.courses"));
    }

    throw error;
  }
};

/**
 * Get all sections for a specific course
 */
export const getAllSections = async (courseId: string) => {
  try {
    const res = await backEndClient.get(`/api/courses/${courseId}/sections`, {
      timeout: timeoutInMs,
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
 * Get a specific section. Same as @see {@link getSectionById}
 */
export const getSection = async (courseId: string, sectionId: string) => {
  try {
    const res = await backEndClient.get(
      `/api/courses/${courseId}/sections/${sectionId}`,
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

/**
 * Get all lectures in a specific section:
 */
export const getLecturesInSection = async (sectionId: string) => {
  try {
    const res = await backEndClient.get(`/api/lectures/section/${sectionId}`, {
      timeout: timeoutInMs,
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
 * Get user subscriptions
 */
export const getSubscriptions = async (userId: string) => {
  try {
    // maybe not best practise to pass user ID as request query
    // but this is the only format where it works
    // passing user ID as request body for get request gives error
    const res = await backEndClient.get(
      `/api/students/${userId}/subscriptions`,
      { timeout: 1200 },
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

/**
 * Subscribe to course
 */
export const subscribeToCourse = async (userId: string, courseId: string) => {
  try {
    await backEndClient.post(`/api/courses/${courseId}/subscribe`, {
      user_id: userId,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

/**
 * Unsubscribe to course
 */
export const unSubscribeToCourse = async (userId: string, courseId: string) => {
  try {
    await backEndClient.post(`/api/courses/${courseId}/unsubscribe`, {
      user_id: userId,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const giveFeedback = async (
  courseId: string,
  feedbackData: {
    rating?: number;
    feedbackText?: string;
    feedbackOptions?: { name: string }[];
  },
) => {
  const { rating, feedbackText, feedbackOptions } = feedbackData;

  try {
    const response = await backEndClient.post(`/api/feedback/${courseId}`, {
      rating: rating,
      feedbackText: feedbackText,
      feedbackOptions: feedbackOptions,
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error giving feedback:",
        error.response?.data || error.message,
      );

      throw error.response?.data || error;
    } else {
      throw error;
    }
  }
};

export const getAllFeedbackOptions = async () => {
  try {
    const response = await backEndClient.get("/api/feedback/options");
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error getting feedback options:",
        error.response?.data.error || error.message,
      );

      throw error.response?.data || error;
    } else {
      throw error;
    }
  }
};

/**
 * Created by the video stream team. This will be improved in next pull request to handle getting different resolutions properly
 * with our new video streaming service in go.
 */
export const getVideoStreamUrl = (fileName: string, resolution: string) => {
  let resolutionPostfix;
  switch (resolution) {
    case "360":
      resolutionPostfix = "_360x640";
      break;
    case "480":
      resolutionPostfix = "_480x854";
      break;
    case "720":
      resolutionPostfix = "_720x1280";
      break;
    case "1080":
      resolutionPostfix = "_1080x1920";
      break;
    default:
      resolutionPostfix = "_360x640";
  }

  return `${process.env.EXPO_PUBLIC_BACK_END_HOST}/api/bucket/stream/${fileName}${resolutionPostfix}.mp4`;
};

export const getLectureById = async (lectureId: string) => {
  try {
    const res = await backEndClient.get(`/api/lectures/${lectureId}`);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const getBucketImage = async (fileName: string) => {
  try {
    const res = await backEndClient.get(`/api/bucket/${fileName}`, {
      responseType: "arraybuffer",
    });

    let fileType = fileName.split(".").pop();

    if (fileType === "jpg") {
      fileType = "jpeg";
    } else if (!fileType) {
      // Default to png
      fileType = "png";
    }

    // Convert the image to base64
    const image = `data:image/${fileType};base64,${Buffer.from(res.data, "base64")}`;
    return image;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const getBucketVideo = async (fileName: string) => {
  try {
    const res = await backEndClient.get(`/api/bucket/${fileName}`, {
      responseType: "arraybuffer",
      headers: {
        Accept: "video/mp4",
      },
    });

    console.log("res.data", res.data);

    const video = `data:video/mp4;base64,${Buffer.from(res.data, "binary").toString("base64")}`;
    return video;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

export const sendMessageToChatbot = async (
  userMessage: string,
  courses: Course[],
): Promise<AudioResponse> => {
  try {
    const response = await backEndClient.post("/api/ai", {
      userInput: userMessage,
      courses: courses,
    });

    return response.data as AudioResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error?.response?.status === 429) {
        throw new Error(error.response.data.error || t("api.rate"));
      }

      throw new Error(t("api.try-again"));
    }

    throw error;
  }
};

export const sendAudioToChatbot = async (
  audioUri: string,
  courses: Course[],
): Promise<AudioResponse> => {
  try {
    const formData = new FormData();

    formData.append("audio", {
      uri: audioUri,
      name: "audio.m4a", // You can use a generic name or dynamically extract it
      type: "audio/m4a", // Ensure this matches the audio type
    } as unknown as Blob);

    formData.append("courses", JSON.stringify(courses));

    const serverResponse = await backEndClient.post(
      "/api/ai/processAudio",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return serverResponse.data as AudioResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data || t("api.audio"));
    }

    throw error;
  }
};

export const sendFeedbackToBackend = async (
  userPrompt: string,
  chatbotResponse: string,
  feedback: boolean,
) => {
  try {
    const response = await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userPrompt, // The user's original input
        chatbotResponse, // The chatbot's response to the user
        feedback, // Thumbs-up (true) or thumbs-down (false)
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      console.error("Failed to send feedback:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error submitting feedback:", error.message);
      return { success: false, error: error.message };
    } else {
      throw error;
    }
  }
};

export const getLeaderboardDataAndUserRank = async ({
  page,
  token,
  timeInterval,
  limit = 80,
  userId,
}: {
  page: number;
  token: string;
  timeInterval: string;
  limit?: number;
  userId: string;
}) => {
  try {
    const res = await backEndClient.post(
      `/api/students/leaderboard`,
      {
        userId, // Include user ID in the request body
        page,
        timeInterval,
        limit,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return {
      leaderboard: res.data.leaderboard,
      currentUserRank: res.data.currentUserRank,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};
