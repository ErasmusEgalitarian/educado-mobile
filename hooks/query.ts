import { client } from "@/api/backend/client.gen";
import { JwtResponse } from "@/api/backend/types.gen";
import {
  addCourseToStudent,
  completeComponent,
  deleteUser,
  getAllComponentsBySectionId,
  getAllCourses,
  getAllFeedbackOptions,
  getAllSectionsByCourseId,
  getAllStudentSubscriptions,
  getBucketImageByFilename,
  getBucketVideoByFilename,
  getCourseById,
  getSectionById,
  getStudentById,
  loginUser,
  subscribeCourse,
  unsubscribeCourse,
  updateStudyStreak,
} from "@/api/legacy-api";
import {
  loginStudentStrapi,
  logoutStudentStrapi,
  signUpStudentStrapi,
} from "@/api/strapi-api";
import { setJWT, setUserInfo } from "@/services/storage-service";
import { isComponentCompleted, isFirstAttemptExercise } from "@/services/utils";
import {
  LoginStudent,
  SectionComponentExercise,
  SectionComponentLecture,
  Student,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  documentDirectory,
  EncodingType,
  writeAsStringAsync,
} from "expo-file-system";

export const queryKeys = {
  courses: ["courses"] as const,
  course: (id: string) => ["course", id] as const,
  subscriptions: (id: string) => ["subscriptions", id] as const,
  loginStudent: ["localStudent"] as const,
  student: (id: string) => ["student", id] as const,
  section: (id: string) => ["section", id] as const,
  sections: (id: string) => ["sections", id] as const,
  studyStreak: ["studyStreak"] as const,
  user: (id: string) => ["user", id] as const,
  lectureVideos: (filename: string) => ["lectureVideos", filename] as const,
  sectionComponents: (id: string) => ["sectionComponents", id] as const,
  feedbackOptions: ["feedbackOptions"] as const,
  bucketImage: (filename: string) => ["bucketImage", filename] as const,
};

/**
 * Get all courses.
 */
export const useCourses = () =>
  useQuery({
    queryKey: queryKeys.courses,
    queryFn: () => getAllCourses(),
  });

/**
 * Get a course by its ID.
 *
 * @param id - The course ID.
 */
export const useCourse = (id: string) =>
  useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

/**
 * Get all components for a section by section ID.
 *
 * @param id - The section ID.
 */
export const useSectionComponents = (id: string) =>
  useQuery({
    queryKey: queryKeys.sectionComponents(id),
    queryFn: () => getAllComponentsBySectionId(id),
  });

/**
 * Subscribe a user to a course.
 */
export const useSubscribeToCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, unknown, { userId: string; courseId: string }>({
    mutationFn: async (variables) => {
      const { userId, courseId } = variables;

      await subscribeCourse(userId, courseId);

      return await addCourseToStudent(userId, courseId);
    },
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.subscriptions(data.baseUser)],
      }),
  });
};

/**
 * Unsubscribe a user from a course.
 */
export const useUnsubscribeFromCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<Student, unknown, { userId: string; courseId: string }>({
    mutationFn: async (variables) => {
      const { userId, courseId } = variables;

      return await unsubscribeCourse(userId, courseId);
    },
    onSuccess: (data) =>
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.subscriptions(data.baseUser)],
      }),
  });
};

/**
 * Get all subscribed courses for a user.
 *
 * @param id - The user ID.
 */
export const useSubscribedCourses = (id: string) =>
  useQuery({
    queryKey: queryKeys.subscriptions(id),
    queryFn: () => getAllStudentSubscriptions(id),
  });

/**
 * Get a student by their ID.
 *
 * @param id - The student ID.
 */
export const useStudent = (id: string) =>
  useQuery({
    queryKey: queryKeys.student(id),
    queryFn: async () => {
      const student = await getStudentById(id);

      if (student.profilePhoto) {
        try {
          student.photo = await getBucketImageByFilename(student.profilePhoto);
        } catch {
          student.photo = null;
        }
      }

      return student;
    },
  });

/**
 * Temporary hook to get the local student info.
 * TODO: Remove and only rely on {@link useStudent}.
 */
export const useLoginStudent = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.loginStudent,
    queryFn: () => ({}) as LoginStudent,
    initialData: () =>
      // After logging in, the local student info is fetched from storage and always available.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      queryClient.getQueryData<LoginStudent>(queryKeys.loginStudent)!,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

/**
 *
 * @param id - The section ID.
 */
export const useSection = (id: string) =>
  useQuery({
    queryKey: queryKeys.section(id),
    queryFn: () => getSectionById(id),
  });

/**
 * Get all sections for a course.
 *
 * @param id - The course ID.
 */
export const useSections = (id: string) =>
  useQuery({
    queryKey: queryKeys.sections(id),
    queryFn: () => getAllSectionsByCourseId(id),
    enabled: !!id,
  });

/**
 * Get the video file path for a lecture video.
 *
 * @param filename - The filename of the video.
 */
export const useLectureVideo = (filename: string) =>
  useQuery({
    queryKey: queryKeys.lectureVideos(filename),
    queryFn: async () => {
      const video = await getBucketVideoByFilename(filename);

      if (!documentDirectory) {
        throw new Error("Document directory is not available");
      }

      const filePath = `${documentDirectory}lectureVideos/${filename}.mp4`;

      await writeAsStringAsync(filePath, video, {
        encoding: EncodingType.Base64,
      });

      return filePath;
    },
  });

/**
 * Delete a user.
 *
 * @param id - The user ID.
 */
export const useDeleteUser = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.student(id), ...queryKeys.user(id)],
      }),
  });
};

/**
 * Get all feedback options.
 */
export const useFeedbackOptions = () =>
  useQuery({
    queryKey: queryKeys.feedbackOptions,
    queryFn: () => getAllFeedbackOptions(),
  });

/**
 * Update a student's study streak.
 */
export const useUpdateStudyStreak = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, unknown, { studentId: string }>({
    mutationFn: (variables) => updateStudyStreak(variables.studentId),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.studyStreak, new Date());
    },
  });
};

/**
 * Log in a user by username and password.
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    LoginStudent,
    unknown,
    { email: string; password: string }
  >({
    mutationFn: (variables) => loginUser(variables.email, variables.password),
    onSuccess: async (data) => {
      // TODO: Remove storage-service.ts and AsyncStorage legacy fallback after full migration to TanStack Query
      await setJWT(data.accessToken);
      await setUserInfo({ ...data.userInfo });
      await AsyncStorage.setItem("loggedIn", "true");

      queryClient.setQueryData(queryKeys.loginStudent, data);

      await queryClient.invalidateQueries({
        queryKey: [...queryKeys.student(data.userInfo.id)],
      });

      return data;
    },
  });
};

/**
 * Log in a user by email and password in strapi.
 *
 */
export const useLoginStrapi = () => {
  return useMutation<JwtResponse, unknown, { email: string; password: string }>(
    {
      mutationFn: (variables) =>
        loginStudentStrapi(variables.email, variables.password),
      onSuccess: (data) => {
        client.setConfig({
          ...client.getConfig(),
          headers: {
            Authorization: `Bearer ${data.accessToken ?? ""}`,
          },
        });
      },
    },
  );
};

/**
 * Sign up a user by email and password in strapi.
 */
export const useSignUpStrapi = () => {
  return useMutation<
    JwtResponse,
    unknown,
    { name: string; email: string; password: string }
  >({
    mutationFn: (variables) =>
      signUpStudentStrapi(variables.name, variables.email, variables.password),
    onSuccess: (data) => {
      client.setConfig({
        ...client.getConfig(),
        headers: {
          Authorization: `Bearer ${data.accessToken ?? ""}`,
        },
      });
    },
  });
};

/**
 * Log out a user by clearing the authorization header.
 * Even thought the logout function is not async we do it this way to stay consistent
 */
export const useLogoutStrapi = () => {
  return useMutation({
    mutationFn: logoutStudentStrapi,
  });
};

/**
 * Complete a component.
 */
export const useCompleteComponent = () => {
  return useMutation<
    Student,
    unknown,
    {
      student: Student;
      component: SectionComponentLecture | SectionComponentExercise;
      isComplete: boolean;
    }
  >({
    mutationFn: (variables) => {
      const { student, component, isComplete } = variables;

      const isFirstAttempt = isFirstAttemptExercise(student, component.id);
      const isCompComplete = isComponentCompleted(student, component.id);

      let points = 0;

      if (isFirstAttempt && !isCompComplete && isComplete) {
        points = 10;
      }

      if (!isFirstAttempt && !isCompComplete && isComplete) {
        points = 5;
      }

      const requestComponent = { ...component, _id: component.id };

      return completeComponent(
        student.baseUser,
        requestComponent,
        isComplete,
        points,
      );
    },
  });
};

/**
 * Get a bucket image by filename.
 *
 * @param filename - The filename of the image.
 */
export const useBucketImage = (filename?: string | null) => {
  return useQuery({
    queryKey: queryKeys.bucketImage(filename ?? ""),
    queryFn: () => getBucketImageByFilename(filename ?? ""),
    enabled: !!filename,
  });
};
