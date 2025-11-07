import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";
import {
  mapToSectionComponent,
  mapToCourse,
  mapToFeedbackOption,
  mapToLeaderboard,
  mapToLecture,
  mapToSection,
  mapToStudent,
  mapToLoginStudent,
} from "@/api/dto-mapper";
import {
  AudioResponseDto,
  CourseDto,
  FeedbackOptionDto,
  LectureDto,
  SectionComponentDto,
  sectionComponentDtoSchema,
  SectionDto,
  StudentDto,
  StudyStreakDto,
  StudentSubscribedCourseDto,
  LeaderboardDto,
  leaderboardDtoSchema,
  LoginResponseDto,
} from "@/types/legacy-api-dto";
import {
  Course,
  LoginStudent,
  SectionComponentExercise,
  SectionComponentLecture,
  User,
} from "@/types";
import * as FileSystem from "expo-file-system";
import {
  courseModelSchema,
  feedbackOptionModelSchema,
  lectureModelSchema,
  loginResponseModelSchema,
  sectionModelSchema,
  studentModelSchema,
  studentSubscribedCourseModelSchema,
  studyStreakModelSchema,
} from "@/types/legacy-api-model";
import { getJWT } from "@/services/storage-service";

const backEndClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_BACK_END_HOST}/api`,
  timeout: 15000,
});

backEndClient.interceptors.request.use(async (config) => {
  const token = await getJWT();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface ApiError {
  code: string;
  message: string;
}

export const toApiError = (error: AxiosError) => {
  const response = error.response;

  const data = response?.data as { error: { code: string; message: string } };

  return {
    code: data.error.code,
    message: data.error.message,
  } as ApiError;
};

/**
 *
 * @param url
 * @param config
 * @returns
 * @throws {@link AxiosError}
 */
const getRequest = async <T>(url: string, config?: AxiosRequestConfig) =>
  await backEndClient.get<T>(url, config);

/**
 *
 * @param url
 * @param body
 * @param config
 */
const postRequest = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
) => await backEndClient.post<T>(url, body, config);

/**
 *
 * @param url
 * @param body
 * @param config
 */
const patchRequest = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
) => await backEndClient.patch<T>(url, body, config);

/**
 *
 * @param url
 * @param body
 * @param config
 */
const putRequest = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
) => await backEndClient.put<T>(url, body, config);

/**
 *
 * @param url
 * @param config
 */
const deleteRequest = async <T>(url: string, config?: AxiosRequestConfig) =>
  await backEndClient.delete<T>(url, config);

/**
 * Gets all components for a specific section.
 *
 * @param id - The section ID.
 * @returns A list of components.
 * @throws {@link AxiosError}
 */
export const getAllComponentsBySectionId = async (id: string) => {
  const response = await getRequest<SectionComponentDto[]>(
    `/courses/sections/${id}/components`,
  );

  const parsed = sectionComponentDtoSchema.array().parse(response.data);

  return parsed.map(mapToSectionComponent);
};

/**
 * Gets a section by ID.
 *
 * @param id - The section ID.
 * @returns A section object.
 * @throws {@link AxiosError}
 */
export const getSectionById = async (id: string) => {
  const response = await getRequest<SectionDto>(`/sections/${id}`);

  const parsed = sectionModelSchema.parse(response.data);

  return mapToSection(parsed);
};

/**
 * Gets a course by ID.
 *
 * @param id - The course ID.
 * @returns A course object.
 * @throws {@link AxiosError}
 */
export const getCourseById = async (id: string) => {
  const response = await getRequest<CourseDto>(`/courses/${id}`);

  const parsed = courseModelSchema.parse(response.data);

  return mapToCourse(parsed);
};

/**
 * Gets all courses.
 *
 * @returns A list of courses.
 * @throws {@link AxiosError}
 */
export const getAllCourses = async () => {
  const response = await getRequest<CourseDto[]>("/courses");

  const parsed = courseModelSchema.array().parse(response.data);

  return parsed.map(mapToCourse);
};

/**
 * Gets all sections for a specific course.
 *
 * @param id - The course ID.
 * @returns A list of sections.
 * @throws {@link AxiosError}
 */
export const getAllSections = async (id: string) => {
  const response = await getRequest<SectionDto[]>(`/courses/${id}/sections`);

  const parsed = sectionModelSchema.array().parse(response.data);

  return parsed.map(mapToSection);
};

/**
 * Gets a specific section.
 *
 * @param courseId - The course ID.
 * @param sectionId - The section ID.
 * @returns A section object.
 * @throws {@link AxiosError}
 */
export const getCourseSectionById = async (
  courseId: string,
  sectionId: string,
) => {
  const response = await getRequest<SectionDto>(
    `/courses/${courseId}/sections/${sectionId}`,
  );

  const parsed = sectionModelSchema.parse(response.data);

  return mapToSection(parsed);
};

/**
 * Gets all lectures in a specific section.
 *
 * @param id - The section ID.
 * @returns A list of lectures.
 * @throws {@link AxiosError}
 */
export const getSectionLecturesById = async (id: string) => {
  const response = await getRequest<LectureDto[]>(`/lectures/section/${id}`);

  const parsed = lectureModelSchema.array().parse(response.data);

  return parsed.map(mapToLecture);
};

/**
 * Gets all courses a user is subscribed to.
 *
 * @param id - The user ID.
 * @returns A list of courses.
 * @throws {@link AxiosError}
 */
export const getAllStudentSubscriptions = async (id: string) => {
  const response = await getRequest<StudentSubscribedCourseDto[]>(
    `/students/${id}/subscriptions`,
  );

  const parsed = studentSubscribedCourseModelSchema
    .array()
    .parse(response.data);

  return parsed.map(mapToCourse);
};

/**
 *
 *
 * @param courseId
 * @param feedbackData
 */
export const giveFeedback = async (
  courseId: string,
  feedbackData: {
    rating?: number;
    feedbackText?: string;
    feedbackOptions?: { name: string }[];
  },
) =>
  await postRequest<string>(`/feedback/${courseId}`, {
    rating: feedbackData.rating,
    feedbackText: feedbackData.feedbackText,
    feedbackOptions: feedbackData.feedbackOptions,
  });

/**
 * Get all feedback options.
 *
 * @throws {@link AxiosError}
 */
export const getAllFeedbackOptions = async () => {
  const response = await getRequest<FeedbackOptionDto[]>("/feedback/options");

  const parsed = feedbackOptionModelSchema.array().parse(response.data);

  return parsed.map(mapToFeedbackOption);
};

/**
 * Created by the video stream team. This will be improved in next pull request to handle getting different resolutions properly
 * with our new video streaming service in go.
 */
export const getVideoStreamUrl = async (
  fileName: string,
  resolution: string,
) => {
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

  return Promise.resolve(
    `${process.env.EXPO_PUBLIC_BACK_END_HOST}/api/bucket/stream/${fileName}${resolutionPostfix}.mp4`,
  );
};

/**
 * Gets a lecture by ID.
 *
 * @param id - The lecture ID.
 * @returns A lecture object.
 * @throws {@link AxiosError}
 */
export const getLectureById = async (id: string) => {
  const response = await getRequest<LectureDto>(`/lectures/${id}`);

  return mapToLecture(response.data);
};

/**
 *
 *
 * @param fileName
 */
export const getBucketImageByFilename = async (fileName: string) => {
  const response = await getRequest<string>(`/bucket/${fileName}`, {
    responseType: "arraybuffer",
  });

  let fileType = fileName.split(".").pop();

  if (fileType === "jpg") {
    fileType = "jpeg";
  } else {
    fileType ??= "png";
  }

  return `data:image/${fileType};base64,${Buffer.from(response.data, "base64").toString()}`;
};

/**
 *
 *
 * @param fileName
 */
export const getBucketVideoByFilename = async (fileName: string) => {
  const response = await getRequest<string>(`/bucket/${fileName}`, {
    responseType: "arraybuffer",
    headers: {
      Accept: "video/mp4",
    },
  });

  return `data:video/mp4;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
};

export const sendMessageToChatbot = async (
  userMessage: string,
  courses: Course[],
) =>
  await postRequest<AudioResponseDto>("/ai", {
    userInput: userMessage,
    courses: courses,
  });

export const sendAudioToChatbot = async (
  audioUri: string,
  courses: Course[],
) => {
  const formData = new FormData();

  formData.append("audio", {
    uri: audioUri,
    name: "audio.m4a",
    type: "audio/m4a",
  } as unknown as Blob);

  formData.append("courses", JSON.stringify(courses));

  return await postRequest<AudioResponseDto>("/ai/processAudio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sendFeedbackToBackend = async (
  userPrompt: string,
  chatbotResponse: string,
  feedback: boolean,
) =>
  await postRequest(
    "/ai/feedback",
    JSON.stringify({
      userPrompt,
      chatbotResponse,
      feedback,
    }),
  );

export const getLeaderboardDataAndUserRank = async ({
  page,
  timeInterval,
  limit = 80,
  userId,
}: {
  page: number;
  timeInterval: string;
  limit?: number;
  userId: string;
}) => {
  const response = await postRequest<LeaderboardDto>("/students/leaderboard", {
    userId,
    page,
    timeInterval,
    limit,
  });

  const parsed = leaderboardDtoSchema.parse(response.data);

  return mapToLeaderboard(parsed);
};

/**
 * Sends a request to the backend to register a new user.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @returns The status code of the registration request.
 * @throws {@link AxiosError}
 */
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password?: string,
) => {
  const response = await postRequest("/auth/signup", {
    firstName,
    lastName,
    email,
    password,
  });

  return response.status;
};

/**
 * Sends a request to the backend to log in an existing user.
 *
 * @param email - should contain an email, to login
 * @param password - should contain a password, to login
 */
export const loginUser = async (email: string, password: string) => {
  const response = await postRequest<LoginResponseDto>("/auth/login", {
    email,
    password,
  });

  const parsed = loginResponseModelSchema.parse(response.data);

  return mapToLoginStudent(parsed);
};

/**
 *
 * @param userId
 * @returns the status code of the deletion request
 */
export const deleteUser = async (userId: string) =>
  await deleteRequest(`/users/${userId}`);

export const updateUserFields = async (
  userId: string,
  obj: { email?: string; firstName?: string; lastName?: string },
) => await patchRequest(`/users/${userId}`, obj);

export const updateUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) =>
  await patchRequest(`/users/${userId}/password`, {
    oldPassword: oldPassword,
    newPassword: newPassword,
  });

/**
 * Marks all courses, sections, and components as completed for a user.
 *
 * @param userId - The user ID.
 * @param component - The component to mark as complete.
 * @param isComplete - The completion status.
 * @param points - The points earned.
 * @returns A student object.
 * @throws {@link AxiosError}
 */
export const completeComponent = async (
  userId: string,
  component: SectionComponentLecture | SectionComponentExercise,
  isComplete: boolean,
  points: number,
) => {
  const response = await patchRequest<StudentDto>(
    `/students/${userId}/complete`,
    {
      comp: component,
      isComplete: isComplete,
      points: points,
    },
  );

  const parsed = studentModelSchema.parse(response.data);

  return mapToStudent(parsed);
};

/**
 * Gets the student info for a specific student.
 *
 * @param id - The student ID.
 * @returns The student info.
 * @throws {@link AxiosError}
 */
export const getStudentById = async (id: string) => {
  const response = await getRequest<StudentDto>(`/students/${id}/info`);

  const parsed = studentModelSchema.parse(response.data);

  return mapToStudent(parsed);
};

/**
 * Subscribes a user to a course.
 *
 * @param userId - The user ID.
 * @param courseId - The course ID.
 * @throws {@link AxiosError}
 */
export const subscribeCourse = async (userId: string, courseId: string) => {
  const response = await postRequest<StudentDto>(
    `/courses/${courseId}/subscribe`,
    {
      user_id: userId,
    },
  );

  const parsed = studentModelSchema.parse(response.data);

  return mapToStudent(parsed);
};

/**
 * Unsubscribes a user from a course.
 *
 * @param userId - The user ID.
 * @param courseId - The course ID.
 * @throws {@link AxiosError}
 */
export const unsubscribeCourse = async (userId: string, courseId: string) => {
  const response = await postRequest(`/courses/${courseId}/unsubscribe`, {
    user_id: userId,
  });

  const parsed = studentModelSchema.parse(response.data);

  return mapToStudent(parsed);
};

/**
 * Enrolls a student in a course.
 *
 * @param userId
 * @param courseId
 * @returns A student object.
 * @throws {@link AxiosError}
 */
export const addCourseToStudent = async (userId: string, courseId: string) => {
  const response = await patchRequest<StudentDto>(
    `/students/${userId}/courses/${courseId}/enroll`,
  );

  const parsed = studentModelSchema.parse(response.data);

  return mapToStudent(parsed);
};

/**
 * Updates the student's profile photo.
 *
 * @param userId - The student ID.
 * @param photo - The photo URI.
 * @returns A student object.
 * @throws {@link AxiosError}
 */
export const uploadPhoto = async (userId: string, photo: string) => {
  const file = await FileSystem.getInfoAsync(photo);

  if (!file.exists) {
    throw new Error("File does not exist");
  }

  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    type: "image/jpeg",
    name: "photo.jpg",
  } as unknown as Blob);

  const response = await putRequest<StudentDto>(
    `/students/${userId}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    },
  );

  const parsed = studentModelSchema.parse(response.data);

  return mapToStudent(parsed);
};

/**
 * Deletes a student's profile photo.
 *
 * @param id - The student ID.
 * @returns A student object.
 * @throws {@link AxiosError}
 */
export const deletePhoto = async (id: string) => {
  const response = await deleteRequest<StudentDto>(`/students/${id}/photo`);

  const parsed = studentModelSchema.parse(response.data);

  return mapToStudent(parsed);
};

/**
 * Function to send mail to user with code to reset password
 *
 * @param email - should contain an email, to receive a reset password message
 * @returns An object with the status of the request.
 * @throws {@link AxiosError}
 */
export const sendResetPasswordEmail = async (email: string) =>
  // This does return a response, but it is never used, therefore i am ignoring it. returns { status: sucess }
  await postRequest<{ status: string }>("/auth/reset-password-request", {
    email,
  });

/**
 * function to validate the code sent to the user
 * @param {Object} obj should contain the following properties:
 * - email
 * - token
 */
export const validateResetPasswordCode = async (obj: {
  email: string;
  token: string;
}) =>
  // This does return a response, but it is never used, therefore i am ignoring it. returns { status: sucess }
  await postRequest("/auth/reset-password-code", obj);

/**
 * When user enters a new password, it should update the password of the user
 *
 * @param email - The user's email.
 * @param token -
 * @param newPassword -
 */
export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string,
) => await patchRequest("/auth/reset-password", { email, token, newPassword });

/**
 * Update student study streak.
 *
 * @param id - The student ID.
 * @throws {@link AxiosError}
 */
export const updateStudyStreak = async (id: string) => {
  const response = await patchRequest<StudyStreakDto>(
    `/students/${id}/updateStudyStreak`,
  );

  return studyStreakModelSchema.parse(response.data);
};

export const getCertificatesByStudentId = async (id: string) => {
  const response = await getRequest(`/student-certificates/student/${id}`);

  return response.data;
};

export const createCertificate = async (
  user: User | LoginStudent,
  course: Course,
) => {
  let id;
  let firstName;
  let lastName;

  if ("firstName" in user) {
    id = user.id;
    firstName = user.firstName;
    lastName = user.lastName;
  }

  if ("userInfo" in user) {
    id = user.userInfo.id;
    firstName = user.userInfo.firstName;
    lastName = user.userInfo.lastName;
  }

  const body = {
    courseName: course.title,
    courseId: course.courseId,
    studentId: id,
    studentFirstName: firstName,
    studentLastName: lastName,
    courseCreator: course.creatorId,
    estimatedCourseDuration: course.estimatedHours || 0,
    dateOfCompletion: new Date().toISOString().split("T")[0],
    courseCategory: course.category,
  };

  const response = await putRequest("/student-certificates", body);

  return response.data;
};
