import axios from "axios";
import { CERTIFICATE_URL } from "@env";
import { getCourse } from "../api/api";
import { getUserInfo } from "./storage-service";
import { getStudentInfo } from "../api/user-api";

// Get certificates from student
export const fetchCertificates = async (userId) => {
  try {
    if (userId == null) {
      throw "User ID is null";
    }
    const res = await axios.get(
      CERTIFICATE_URL + "/api/student-certificates/student/" + userId,
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

/* Generates a certificate for a student.
 * @param {string} courseId - The ID of the course.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} - The response from the server.
 */
export const generateCertificate = async (courseId, userId) => {
  try {
    // Fetch course data
    const courseData = await getCourse(courseId);

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
      courseId: courseData._id,
      studentId: studentData._id,
      studentFirstName: userData.firstName,
      studentLastName: userData.lastName,
      courseCreator: courseData.creator,
      estimatedCourseDuration: courseData.estimatedHours || 0,
      dateOfCompletion: new Date().toISOString().split("T")[0], // current date
      courseCategory: courseData.category,
    };

    // Call the endpoint to generate the certificate
    const response = await axios.put(
      CERTIFICATE_URL + "/api/student-certificates",
      object,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error generating certificate:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
