import MockAdapter from "axios-mock-adapter";
import { mockDataAPI } from "@/__tests__/mockData/mockDataAPI";
import {
  getCourse,
  getCourses,
  getAllSections,
  getSection,
  getSubscriptions,
  subscribeToCourse,
  unSubscribeToCourse,
  giveFeedback,
  getAllFeedbackOptions,
} from "@/api/api";
import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { backEndClient } from "@/axios";
import { isAxiosError } from "axios";

jest.mock("@react-native-async-storage/async-storage");

let mock: MockAdapter;

const mockData = mockDataAPI();

describe("API Functions", () => {
  beforeEach(() => {
    mock = new MockAdapter(backEndClient);
  });

  afterEach(() => {
    mock.reset();
    mock.restore();
  });

  describe("getCourse", () => {
    it("should get a specific course", async () => {
      const courseId = mockData.courseData._id;

      mock.onGet(`/api/courses/${courseId}`).reply(200, mockData.courseData);

      const result = await getCourse(courseId);

      expect(result).toEqual(mockData.courseData);
    });

    it("should handle errors", async () => {
      const courseId = mockData.courseData._id;
      const errorData = { message: "Course not found" };

      mock.onGet(`/api/courses/${courseId}`).reply(500, errorData);

      await expect(getCourse(courseId)).rejects.toEqual(errorData);
    });
  });

  describe("getCourses", () => {
    it("should get all courses", async () => {
      mock.onGet("/api/courses").reply(200, mockData.allCoursesData);

      const result = await getCourses();

      expect(result).toEqual(mockData.allCoursesData);
    });

    it("should handle errors", async () => {
      const errorData = new Error("Failed to load courses");

      mock.onGet("/api/courses").reply(500, errorData);

      await expect(getCourses()).rejects.toEqual(errorData);
    });
  });

  describe("getAllSections", () => {
    it("should get all sections for a specific course", async () => {
      const courseId = mockData.courseData._id;
      mock
        .onGet(`/api/courses/${courseId}/sections`)
        .reply(200, mockData.sectionData);

      const result = await getAllSections(courseId);

      expect(result).toEqual(mockData.sectionData);
    });

    it("should handle errors", async () => {
      const courseId = mockData.courseData._id;
      const errorData = { message: "Course not found" };

      mock.onGet(`/api/courses/${courseId}/sections`).reply(500, errorData);

      await expect(getAllSections(courseId)).rejects.toEqual(errorData);
    });
  });

  describe("getSection", () => {
    it("should get a specific section", async () => {
      const courseId = mockData.courseData._id;
      const sectionId = mockData.sectionData[0]._id;

      mock
        .onGet(`/api/courses/${courseId}/sections/${sectionId}`)
        .reply(200, mockData.sectionData);

      const result = await getSection(courseId, sectionId);

      expect(result).toEqual(mockData.sectionData);
    });

    it("should handle errors", async () => {
      const courseId = mockData.courseData._id;
      const sectionId = mockData.sectionData[0]._id;
      const errorData = { message: "Course not found" };

      mock
        .onGet(`/api/courses/${courseId}/sections/${sectionId}`)
        .reply(500, errorData);

      await expect(getSection(courseId, sectionId)).rejects.toEqual(errorData);
    });
  });

  describe("getSubscriptions", () => {
    it("should get user subscriptions", async () => {
      const userId = mockData.userData._id;

      mock
        .onGet(`/api/students/${userId}/subscriptions`)
        .reply(200, mockData.subscribedCourses);

      const result = await getSubscriptions(userId);

      expect(result).toEqual(mockData.subscribedCourses);
    });

    it("should handle errors", async () => {
      const userId = mockData.userData._id;
      const errorData = { message: "Course not found" };

      mock.onGet(`/api/students/${userId}/subscriptions`).reply(500, errorData);

      await expect(getSubscriptions(userId)).rejects.toEqual(errorData);
    });
  });

  describe("subscribeToCourse", () => {
    it("should subscribe to a course", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;

      mock
        .onPost(`/api/courses/${courseId}/subscribe`, {
          user_id: userId,
        })
        .reply(200);

      await subscribeToCourse(userId, courseId);

      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toBe(
        `/api/courses/${courseId}/subscribe`,
      );
    });

    it("should handle errors", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;
      const errorData = { message: "Course not found" };

      mock.onPost(`/api/courses/${courseId}/subscribe`).reply(500, errorData);

      await expect(subscribeToCourse(userId, courseId)).rejects.toEqual(
        errorData,
      );
    });
  });

  describe("unSubscribeToCourse", () => {
    it("should unsubscribe to a course", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;

      mock
        .onPost(`/api/courses/${courseId}/unsubscribe`, {
          user_id: userId,
        })
        .reply(200);

      await unSubscribeToCourse(userId, courseId);

      expect(mock.history.post.length).toBe(1);
      expect(mock.history.post[0].url).toBe(
        `/api/courses/${courseId}/unsubscribe`,
      );
    });

    it("should handle errors", async () => {
      const userId = mockData.userData._id;
      const courseId = mockData.courseData._id;
      const errorData = { message: "Course not found" };

      mock.onPost(`/api/courses/${courseId}/unsubscribe`).reply(500, errorData);

      await expect(unSubscribeToCourse(userId, courseId)).rejects.toEqual(
        errorData,
      );
    });
  });

  describe("giveFeedback", () => {
    const courseId = "course123";
    const feedbackData = {
      rating: 5,
      feedbackText: "Great course!",
      feedbackOptions: [{ name: "option1" }, { name: "option2" }],
    };

    it("should submit feedback successfully", async () => {
      mock.onPost(`/api/feedback/${courseId}`).reply(200, "OK");

      const result = await giveFeedback(courseId, feedbackData);

      expect(result).toEqual("OK");
      expect(mock.history.post.length).toBe(1);
    });

    it('should rethrow "Feedback must contain a rating" error', async () => {
      const invalidFeedbackData = {
        rating: null,
        feedbackText: "Great course!",
        feedbackOptions: [{ name: "option1" }, { name: "option2" }],
      };

      mock.onPost(`/api/feedback/${courseId}`).reply(400, {
        error: "Feedback must contain a rating",
        code: "E1303",
      });

      await expect(
        // @ts-expect-error TS2345 The rating is supposed to be null for this test...
        giveFeedback(courseId, invalidFeedbackData),
      ).rejects.toMatchObject({
        error: "Feedback must contain a rating",
        code: "E1303",
      });
    });

    it('should rethrow "Feedback options must be an array" error', async () => {
      const invalidFeedbackData = {
        rating: 5,
        feedbackText: "Great course!",
        feedbackOptions: "not an array",
      };

      mock.onPost(`/api/feedback/${courseId}`).reply(400, {
        error: "Feedback options must be an array",
        code: "E1304",
      });

      await expect(
        // @ts-expect-error TS2345 Of course the type is wrong...
        giveFeedback(courseId, invalidFeedbackData),
      ).rejects.toMatchObject({
        error: "Feedback options must be an array",
        code: "E1304",
      });
    });

    it('should rethrow "Could not save feedback entry" error', async () => {
      mock.onPost(`/api/feedback/${courseId}`).reply(400, {
        error: "Could not save feedback entry",
        code: "E1305",
      });

      await expect(giveFeedback(courseId, feedbackData)).rejects.toMatchObject({
        error: "Could not save feedback entry",
        code: "E1305",
      });
    });

    it('should rethrow "Course not found" error', async () => {
      mock.onPost(`/api/feedback/${courseId}`).reply(404, {
        error: "Course not found",
        code: "E0006",
      });

      await expect(giveFeedback(courseId, feedbackData)).rejects.toMatchObject({
        error: "Course not found",
        code: "E0006",
      });
    });
  });

  describe("getAllFeedbackOptions", () => {
    it("should retrieve all feedback options successfully", async () => {
      const mockFeedbackOptions = [
        { option: "Option 1" },
        { option: "Option 2" },
      ];

      mock.onGet("/api/feedback/options").reply(200, mockFeedbackOptions);

      const result = await getAllFeedbackOptions();

      expect(result).toEqual(mockFeedbackOptions);
    });

    it('should rethrow "no feedback options found" error', async () => {
      mock.onGet("/api/feedback/options").reply(400, {
        error: "No feedback options found",
      });

      await expect(getAllFeedbackOptions()).rejects.toMatchObject({
        error: "No feedback options found",
      });
    });

    it("should throw network error", async () => {
      mock.onGet("/api/feedback/options").networkError();

      try {
        await getAllFeedbackOptions();
      } catch (error) {
        if (isAxiosError(error)) {
          expect(error.message).toBe("Network Error");
        }
      }
    });
  });
});
