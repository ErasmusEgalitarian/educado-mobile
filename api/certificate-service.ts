import axios, { isAxiosError } from "axios";
import { getUserInfo } from "../services/storage-service";
import { getStudentInfo } from "./user-api";
import { certificateServiceClient } from "../axios";
import { getCourseByIdStrapi } from "@/api/strapi-api";

// Get certificates from student
export const fetchCertificates = async (userId: string) => {
  try {
    if (userId == null) {
      throw "User ID is null";
    }

    const res = await certificateServiceClient.get(
      `/api/student-certificates/student/${userId}`,
    );

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw error;
    }
  }
};

/* Generates a certificate for a student.
 * @param {string} courseId - The ID of the course.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} - The response from the server.
 */
export const generateCertificate = async (
  courseId: string,
  userId: string | null | undefined,
) => {
  try {
    // Fetch course data
    const courseData = await getCourseByIdStrapi(courseId);

    // Fetch student data and user data concurrently
    const [studentData, userData] = await Promise.all([
      getStudentInfo(userId),
      getUserInfo(),
    ]);

    // Ensure data is loaded
    if (!courseData || !studentData || !userData) {
      throw new Error("Course, student, or user data not loaded");
    }

    const object = {
      courseName: courseData.title,
      courseId: courseData.courseId,
      studentId: studentData.id,
      studentFirstName: userData.firstName,
      studentLastName: userData.lastName,
      courseCreator: courseData.creatorId,
      estimatedCourseDuration: courseData.estimatedHours || 0,
      dateOfCompletion: new Date().toISOString().split("T")[0], // current date
      courseCategory: courseData.category,
    };

    // Call the endpoint to generate the certificate
    const response = await certificateServiceClient.put(
      "/api/student-certificates",
      object,
    );

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error generating certificate:",
        error.response?.data || error.message,
      );
      throw error;
    } else {
      throw error;
    }
  }
};