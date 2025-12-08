import {
  addCourseToStudent,
  deleteUser,
  getBucketImageByFilename,
  getBucketVideoByFilename,
  getLeaderboardDataAndUserRank,
  subscribeCourse,
  unsubscribeCourse,
} from "@/api/legacy-api";
import {
  getAllCoursesStrapi,
  getCourseByIdStrapi,
  getAllStudentSubscriptionsStrapi,
  loginStudentStrapi,
  logoutStudentStrapi,
  signUpStudentStrapi,
  getAllSectionsByCourseIdStrapi,
  getAllComponentsBySectionIdStrapi,
  getStudentByIdStrapi,
  getAllFeedbackOptionsStrapi,
  completeComponentStrapi,
  updateStudyStreakStrapi,
} from "@/api/strapi-api";
import { setAuthToken } from "@/api/openapi/api-config";
import { isComponentCompleted } from "@/services/utils";
import {
  LoginStudent,
  SectionComponentExercise,
  SectionComponentLecture,
  Student,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { File, Paths } from "expo-file-system";
import { EncodingType } from "expo-file-system/src/ExpoFileSystem.types";

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
  leaderboard: (id: string, page: number) => ["leaderboard", id, page] as const,
};

/**
 * Get all courses.
 */
export const useCourses = () =>
  useQuery({
    queryKey: queryKeys.courses,
    queryFn: () => getAllCoursesStrapi(),
  });

/**
 * Get a course by its ID.
 *
 * @param id - The course ID.
 */
export const useCourse = (id: string) =>
  useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => getCourseByIdStrapi(id),
    enabled: !!id,
  });

/**
 * Get all components for a section by section ID.
 *
 * @param id - The section ID.
 */
export const useSectionComponents = (id: string) =>
  useQuery({
    queryKey: queryKeys.section(id),
    queryFn: () => getAllComponentsBySectionIdStrapi(id),
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
    queryFn: () => getAllStudentSubscriptionsStrapi(id),
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
      const student = await getStudentByIdStrapi(id);

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
 * Get all sections for a course.
 *
 * @param id - The course ID.
 */
export const useSections = (id: string) =>
  useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => getAllSectionsByCourseIdStrapi(id),
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

      const file = new File(Paths.document, "lectureVideos", `${filename}.mp4`);

      file.write(video, { encoding: EncodingType.Base64 });

      return file.uri;
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
    queryFn: () => getAllFeedbackOptionsStrapi(),
  });

/**
 * Update a student's study streak.
 */
export const useUpdateStudyStreak = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, unknown, { studentId: string }>({
    mutationFn: (variables) => updateStudyStreakStrapi(variables.studentId),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.studyStreak, new Date());
    },
  });
};

/**
 * Log in a user by email and password in strapi.
 *
 */
export const useLoginStrapi = () => {
  const queryClient = useQueryClient();

  return useMutation<
    LoginStudent,
    unknown,
    { email: string; password: string }
  >({
    mutationFn: async (variables) => {
      return await loginStudentStrapi(variables.email, variables.password);
    },
    onSuccess: async (data) => {
      // Store token in AsyncStorage for HTTP interceptor
      await setAuthToken(data.accessToken);

      // Store full login data in TanStack Query cache for UI
      queryClient.setQueryData(queryKeys.loginStudent, data);

      // Invalidate student queries to refetch with new data
      await queryClient.invalidateQueries({
        queryKey: [...queryKeys.student(data.userInfo.id)],
      });

      return data;
    },
  });
};

/**
 * Sign up a user by email and password in strapi.
 */
export const useSignUpStrapi = () => {
  const queryClient = useQueryClient();

  return useMutation<
    LoginStudent,
    unknown,
    { name: string; email: string; password: string }
  >({
    mutationFn: (variables) =>
      signUpStudentStrapi(variables.name, variables.email, variables.password),
    onSuccess: async (data) => {
      // Store token in AsyncStorage for HTTP interceptor
      await setAuthToken(data.accessToken);

      // Store full login data in TanStack Query cache for UI
      queryClient.setQueryData(queryKeys.loginStudent, data);

      // Invalidate student queries to refetch with new data
      await queryClient.invalidateQueries({
        queryKey: [...queryKeys.student(data.userInfo.id)],
      });
    },
  });
};

/**
 * Log out a user by clearing the authorization header and cache.
 */
export const useLogoutStrapi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutStudentStrapi,
    onSuccess: async () => {
      // Clear token from AsyncStorage so interceptor stops adding it
      await setAuthToken(null);

      // Clear login data from query cache
      queryClient.removeQueries({ queryKey: queryKeys.loginStudent });
    },
  });
};

/**
 * Complete a component using Strapi backend.
 */
export const useCompleteComponent = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Student,
    unknown,
    {
      student: Student;
      component: SectionComponentLecture | SectionComponentExercise;
      isComplete: boolean;
    }
  >({
    mutationFn: async (variables) => {
      const { student, component, isComplete } = variables;

      // Calculate points based on completion status
      // TODO: Implement isFirstAttemptExercise for Strapi when component progress tracking is added
      const isCompComplete = isComponentCompleted(student, component.id);

      let points = 0;

      // If component is not already complete and user is completing it now
      if (!isCompComplete && isComplete) {
        // Give 10 points for first completion (simplified for now)
        // TODO: Track first attempt vs retry when Strapi component progress is implemented
        points = 10;
      }

      // Determine component type based on the component structure
      const componentType = "question" in component ? "exercise" : "lecture";

      return await completeComponentStrapi(
        student.id,
        component.id,
        componentType,
        isComplete,
        points,
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.student(data.baseUser), data);

      const local = queryClient.getQueryData<LoginStudent>(
        queryKeys.loginStudent,
      );

      if (local) {
        queryClient.setQueryData<LoginStudent>(queryKeys.loginStudent, {
          ...local,
          userInfo: {
            ...local.userInfo,
            courses: data.courses,
            points: data.points,
          },
        });
      }
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

export const useLeaderboard = (id: string, page: number) => {
  return useQuery({
    queryKey: queryKeys.leaderboard(id, page),
    queryFn: () =>
      getLeaderboardDataAndUserRank({
        page: page,
        timeInterval: "all",
        limit: 12,
        userId: id,
      }),
  });
};
