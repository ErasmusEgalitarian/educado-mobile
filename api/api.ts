import axios from "axios";
import { Buffer } from "buffer";
import { URL, CERTIFICATE_URL } from "@env";

const timeoutInMs = 1200;

// move these to .env file next sprint
const url = URL;
export const certificateUrl = CERTIFICATE_URL;

/* Commented out for avoiding linting errors :))
 * TODO: move IP address to .env file !!!
const testUrl = 'http://localhost:8888';In 
const testExpo = 'http://172.30.211.57:8888'; 
const digitalOcean = 'http://207.154.213.68:8888';
*/

/*** COURSE, SECTIONS AND EXERCISES ***/

// Get components for a specific section
export const getComponents = async (sectionId) => {
  try {
    const res = await axios.get(
      url + "/api/courses/sections/" + sectionId + "/components",
    );
    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

export const getSectionById = async (sectionId) => {
  try {
    const res = await axios.get(url + "/api/sections/" + sectionId);
    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// Get specific course

export const getCourse = async (courseId) => {
  try {
    const res = await axios.get(url + "/api/courses/" + courseId, {
      timeout: timeoutInMs,
    });
    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// Get all courses
export const getCourses = async () => {
  try {
    const res = await axios.get(url + "/api/courses");
    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// Get all sections for a specific course
export const getAllSections = async (courseId) => {
  try {
    const res = await axios.get(
      url + "/api/courses/" + courseId + "/sections",
      { timeout: timeoutInMs },
    );
    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// Get specific section
// ************* same as getSectionById *************
export const getSection = async (courseId, sectionId) => {
  try {
    const res = await axios.get(
      url + "/api/courses/" + courseId + "/sections/" + sectionId,
    );
    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// Get all lectures in a specific section:
export const getLecturesInSection = async (sectionId) => {
  try {
    const res = await axios.get(url + "/api/lectures/section/" + sectionId, {
      timeout: timeoutInMs,
    });
    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

/*** SUBSCRIPTION ***/

// Get user subscriptions
export const getSubscriptions = async (userId) => {
  try {
    // maybe not best practise to pass user ID as request query
    // but this is the only format where it works
    // passing user ID as request body for get request gives error
    const res = await axios.get(
      url + "/api/students/" + userId + "/subscriptions",
      { timeout: 1200 },
    );

    return res.data;
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// Subscribe to course
export const subscribeToCourse = async (userId, courseId) => {
  try {
    await axios.post(url + "/api/courses/" + courseId + "/subscribe", {
      user_id: userId,
    });
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

// Unsubscribe to course
export const unSubscribeToCourse = async (userId, courseId) => {
  try {
    await axios.post(url + "/api/courses/" + courseId + "/unsubscribe", {
      user_id: userId,
    });
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};

export const giveFeedback = async (courseId, feedbackData) => {
  const { rating, feedbackText, feedbackOptions } = feedbackData;
  try {
    const response = await axios.post(url + "/api/feedback/" + courseId, {
      rating: rating,
      feedbackText: feedbackText,
      feedbackOptions: feedbackOptions,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error giving feedback:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getAllFeedbackOptions = async () => {
  try {
    const response = await axios.get(`${url}/api/feedback/options`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting feedback options:",
      error.response?.data.error || error.message,
    );
    throw error;
  }
};

//CREATED BY VIDEO STREAM TEAM
/*This will be improved in next pull request to handle getting different resolutions properly 
with our new video streaming service in go.
*/

export const getVideoStreamUrl = (fileName, resolution) => {
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

  return `${url}/api/bucket/stream/${fileName}${resolutionPostfix}.mp4`;
};

export const getLectureById = async (lectureId) => {
  try {
    const res = await axios.get(url + "/api/lectures/" + lectureId);
    return res.data;
  } catch (err) {
    if (err?.response?.data != null) {
      throw err.response.data;
    } else {
      throw err;
    }
  }
};

export const getBucketImage = async (fileName) => {
  try {
    const res = await axios.get(`${url}/api/bucket/${fileName}`, {
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
  } catch (err) {
    if (err?.response?.data != null) {
      throw err.response.data;
    } else {
      throw err;
    }
  }
};

export const getBucketVideo = async (fileName) => {
  try {
    const res = await axios.get(`${url}/api/bucket/${fileName}`, {
      responseType: "arraybuffer",
      accept: "video/mp4",
    });

    console.log("res.data", res.data);

    const video = `data:video/mp4;base64,${Buffer.from(res.data, "binary").toString("base64")}`;
    return video;
  } catch (err) {
    if (err?.response?.data != null) {
      throw err.response.data;
    } else {
      throw err;
    }
  }
};

export const sendMessageToChatbot = async (userMessage, courses) => {
  try {
    const response = await axios.post(url + "/api/ai", {
      userInput: userMessage,
      courses: courses,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return "Erro: Tente novamente.";
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      // Handle rate-limiting error
      return error.response.data.error || "Acalme-se! Muitas solicitações.";
    }

    console.warn("Axios error:", error);
    return "Erro: Tente novamente.";
  }
};

export const sendAudioToChatbot = async (audioUri, courses) => {
  try {
    const formData = new FormData();
    formData.append("audio", {
      uri: audioUri,
      name: "audio.m4a", // You can use a generic name or dynamically extract it
      type: "audio/m4a", // Ensure this matches the audio type
    });

    formData.append("courses", JSON.stringify(courses));

    // Send the formData via Axios
    const serverResponse = await axios.post(
      url + "/api/ai/processAudio",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return serverResponse.data;
  } catch (error) {
    console.error("Error sending audio data:", error);
    throw error;
  }
};

export const sendFeedbackToBackend = async (
  userPrompt,
  chatbotResponse,
  feedback,
) => {
  try {
    const response = await fetch(url + "/api/ai/feedback", {
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
    console.error("Error submitting feedback:", error.message);
    return { success: false, error: error.message };
  }
};

export const getLeaderboardDataAndUserRank = async ({
  page,
  token,
  timeInterval,
  limit = 80,
  userId,
}) => {
  try {
    const res = await axios.post(
      `${url}/api/students/leaderboard`,
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
  } catch (e) {
    if (e?.response?.data != null) {
      throw e.response.data;
    } else {
      throw e;
    }
  }
};
