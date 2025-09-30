import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockDataAPI } from "../mockData/mockDataAPI";
import { URL } from "@env";

import {
  getCourse,
  getCourses,
  getAllSections,
  getSection,
  getSubscriptions,
  subscribeToCourse,
  unSubscribeToCourse,
  ifSubscribed,
  giveFeedback,
  getAllFeedbackOptions,
} from "../../api/api";

jest.mock("axios");
jest.mock("@react-native-async-storage/async-storage");

const mock = new MockAdapter(axios);

const port = "https://educado-backend-staging-x7rgvjso4a-ew.a.run.app/";

const mockData = mockDataAPI();

describe("API Functions", () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
  });

  describe("getCourse", () => {
    it("should get a specific course", async () => {
      const courseId = mockData.courseData._id;
      axios.get.mockResolvedValue({ data: mockData.courseData });

      const result = await getCourse(courseId);

      //expect(axios.get).toHaveBeenCalledWith(`${port}/api/courses/${courseId}`);
      expect(result).toEqual(mockData.courseData);
    });

    it("should handle errors", async () => {
      const courseId = mockData.courseData._id;
      const errorMessage =
        "Error getting specific course: " + mockData.errorResponse;

      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getCourse(courseId)).rejects.toThrow(errorMessage);
    });
  });

  describe("getCourses", () => {
    it("should get all courses", async () => {
      axios.get.mockResolvedValue({ data: mockData.allCoursesData });

      const result = await getCourses();

      //expect(axios.get).toHaveBeenCalledWith(`${port}/api/courses`);
      expect(result).toEqual(mockData.allCoursesData);
    });

    it("should handle errors", async () => {
      const errorMessage =
        "Error getting all courses: " + mockData.errorResponse;

      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getCourses()).rejects.toThrow(errorMessage);
    });
  });

  describe("getAllSections", () => {
    it("should get all sections for a specific course", async () => {
      const courseId = mockData.courseData._id;
      axios.get.mockResolvedValue({ data: mockData.sectionsData });

      const result = await getAllSections(courseId);

      // expect(axios.get).toHaveBeenCalledWith(`${port}/api/courses/${courseId}/sections`);
      expect(result).toEqual(mockData.sectionsData);
    });

    it("should handle errors", async () => {
      const courseId = mockData.courseData._id;
      const errorMessage =
        "Error getting all sections: " + mockData.errorResponse;

      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getAllSections(courseId)).rejects.toThrow(errorMessage);
    });
  });

  describe("getSection", () => {
    it("should get a specific section", async () => {
      const courseId = mockData.courseData._id;
      const sectionId = mockData.sectionData._id;
      axios.get.mockResolvedValue({ data: mockData.sectionData });

      const result = await getSection(courseId, sectionId);

      //expect(axios.get).toHaveBeenCalledWith(`${port}/api/courses/${courseId}/sections/${sectionId}`);
      expect(result).toEqual(mockData.sectionData);
    });

    it("should handle errors", async () => {
      const courseId = mockData.courseData._id;
      const sectionId = mockData.sectionData._id;
      const errorMessage =
        "Error getting specific section: " + mockData.errorResponse;

      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getSection(courseId, sectionId)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("getSubscriptions", () => {
    it("should get user subscriptions", async () => {
      const userId = mockData.userData._id;

      mock
        .onGet(`/api/students/${userId}/subscriptions`)
        .reply(200, { data: mockData.subscriptionData });

      axios.get.mockResolvedValue({
        data: mockData.subscribeData,
        data: mockData.subscriptionData,
      });

      const result = await getSubscriptions(userId);

      // Check that axios.get was called with the correct URL
      //expect(axios.get).toHaveBeenCalledWith(`${port}/api/students/${userId}/subscriptions`);
      expect(result).toEqual(mockData.subscriptionData);
    });

    it("should handle errors", async () => {
      const userId = mockData.userData._id;
      const errorMessage =
        "Error getting subscriptions: " + mockData.errorResponse;

      axios.get.mockRejectedValue(new Error(errorMessage));

      await expect(getSubscriptions(userId)).rejects.toThrow(errorMessage);
    });
  });

  describe("subscribeToCourse", () => {
    it("should subscribe to a course", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;

      await subscribeToCourse(userId, courseId);

      /* expect(axios.post).toHaveBeenCalledWith(`${port}/api/courses/${courseId}/subscribe`, {
        user_id: userId,
      }); */
    });

    it("should handle errors", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;
      const errorMessage =
        "Error subscribing to course: " + mockData.errorResponse;

      axios.post.mockRejectedValue(new Error(errorMessage));

      await expect(subscribeToCourse(userId, courseId)).rejects.toThrow(
        errorMessage,
      );
    });
  });

  describe("unSubscribeToCourse", () => {
    it("should unsubscribe to a course", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;

      await unSubscribeToCourse(userId, courseId);

      /* expect(axios.post).toHaveBeenCalledWith(`${port}/api/courses/${courseId}/unsubscribe`, {
       user_id: userId,
      }); */
    });

    it("should handle errors", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;
      const errorMessage =
        "Error unsubscribing to course: " + mockData.errorResponse;

      axios.post.mockRejectedValue(new Error(errorMessage));

      await expect(unSubscribeToCourse(userId, courseId)).rejects.toThrow(
        errorMessage,
      );
    });
  });
  describe("giveFeedback", () => {
    const courseId = "course123";
    const feedbackData = {
      rating: 5,
      feedbackText: "Great course!",
      feedbackOptions: ["option1", "option2"],
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should submit feedback successfully", async () => {
      const mockResponse = { data: "OK" };
      axios.post.mockResolvedValue(mockResponse);

      const result = await giveFeedback(courseId, feedbackData);

      expect(result).toEqual("OK");
      expect(axios.post).toHaveBeenCalledWith(
        `${URL}/api/feedback/${courseId}`,
        feedbackData,
      );
    });

    it('should rethrow "Feedback must contain a rating" error', async () => {
      const invalidFeedbackData = {
        rating: null,
        feedbackText: "Great course!",
        feedbackOptions: ["option1", "option2"],
      };
      const errorMessage = "Feedback must contain a rating";
      axios.post.mockImplementation((url, data) => {
        if (data.rating === null) {
          return Promise.reject({
            response: {
              status: 400,
              data: { error: errorMessage, code: "E1303" },
            },
          });
        }
        return Promise.resolve({ data: "OK" });
      });
      try {
        await giveFeedback(courseId, invalidFeedbackData);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe(errorMessage);
        expect(error.response.data.code).toBe("E1303");
      }
      expect(axios.post).toHaveBeenCalledWith(
        `${URL}/api/feedback/${courseId}`,
        invalidFeedbackData,
      );
    });

    it('should rethrow "Feedback options must be an array" error', async () => {
      const errorMessage = "Feedback options must be an array";
      const invalidFeedbackData = {
        rating: 5,
        feedbackText: "Great course!",
        feedbackOptions: "not an array",
      };

      axios.post.mockImplementation((url, data) => {
        if (!Array.isArray(data.feedbackOptions)) {
          return Promise.reject({
            response: {
              status: 400,
              data: { error: errorMessage, code: "E1304" },
            },
          });
        }
        return Promise.resolve({ data: "OK" });
      });

      try {
        await giveFeedback(courseId, invalidFeedbackData);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe(errorMessage);
        expect(error.response.data.code).toBe("E1304");
      }
      expect(axios.post).toHaveBeenCalledWith(
        `${URL}/api/feedback/${courseId}`,
        invalidFeedbackData,
      );
    });

    it('should rethrow "Could not save feedback entry" error', async () => {
      const errorMessage = "Could not save feedback entry";
      axios.post.mockImplementation((url, data) => {
        return Promise.reject({
          response: {
            status: 400,
            data: { error: errorMessage, code: "E1305" },
          },
        });
      });
      try {
        await giveFeedback(courseId, feedbackData);
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe(errorMessage);
        expect(error.response.data.code).toBe("E1305");
      }
      expect(axios.post).toHaveBeenCalledWith(
        `${URL}/api/feedback/${courseId}`,
        feedbackData,
      );
    });

    it('should rethrow "Course not found" error', async () => {
      const errorMessage = "Course not found";
      axios.post.mockImplementation((url, data) => {
        return Promise.reject({
          response: {
            status: 404,
            data: { error: errorMessage, code: "E0006" },
          },
        });
      });

      try {
        await giveFeedback(courseId, feedbackData);
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.error).toBe(errorMessage);
        expect(error.response.data.code).toBe("E0006");
      }

      expect(axios.post).toHaveBeenCalledWith(
        `${URL}/api/feedback/${courseId}`,
        feedbackData,
      );
    });
  });

  describe("getAllFeedbackOptions", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should retrieve all feedback options successfully", async () => {
      const mockFeedbackOptions = [
        { option: "Option 1" },
        { option: "Option 2" },
      ];
      axios.get.mockResolvedValue({ data: mockFeedbackOptions });

      const result = await getAllFeedbackOptions();

      expect(result).toEqual(mockFeedbackOptions);
      expect(axios.get).toHaveBeenCalledWith(`${URL}/api/feedback/options`);
    });

    it('should rethrow "no feedback options found" error', async () => {
      const errorMessage = "No feedback options found";
      axios.get.mockRejectedValue({
        response: {
          status: 400,
          data: { error: errorMessage },
        },
      });

      try {
        await getAllFeedbackOptions();
      } catch (error) {
        expect(error.response).toBeDefined();
        expect(error.response.status).toBe(400);
        expect(error.response.data.error).toBe(errorMessage);
      }

      expect(axios.get).toHaveBeenCalledWith(`${URL}/api/feedback/options`);
    });

    it("should throw network error", async () => {
      const errorMessage = "Network Error";
      axios.get.mockRejectedValue(new Error(errorMessage));

      try {
        await getAllFeedbackOptions();
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }

      expect(axios.get).toHaveBeenCalledWith(`${URL}/api/feedback/options`);
    });
  });
});
