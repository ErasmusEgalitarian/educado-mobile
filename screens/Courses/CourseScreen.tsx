import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as StorageService from "@/services/storage-service";
import { getStudentInfo } from "@/services/storage-service";
import CourseCard from "@/components/Courses/CourseCard/CourseCard";
import IconHeader from "@/components/General/IconHeader";
import { shouldUpdate } from "@/services/utils";
import ToastNotification from "@/components/General/ToastNotification";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import NetworkStatusObserver from "@/hooks/NetworkStatusObserver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import errorSwitch from "@/components/General/error-switch";
import ShowAlert from "@/components/General/ShowAlert";
import Tooltip from "@/components/Onboarding/Tooltip";
import ProfileStatsBox from "@/components/Profile/ProfileStatsBox";
import OfflineScreen from "@/screens/Offline/OfflineScreen";
import { Course } from "@/types/course";
import { StudentInfo } from "@/types/student";
import { t } from "@/i18n";
import {BaseScreen} from "@/components/General/BaseScreen";

const CourseScreen = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseLoaded, setCourseLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentLevel, setStudentLevel] = useState(0);
  const [studentPoints, setStudentPoints] = useState(0);
  const navigation = useNavigation();

  /**
   * Asynchronous function that loads the courses from storage and updates the state.
   * @returns {void}
   */
  const loadCourses = async (): Promise<void> => {
    const courseData = await StorageService.getSubCourseList();
    if (shouldUpdate(courses, courseData)) {
      const hasValidCourseData =
        courseData && Array.isArray(courseData) && courseData.length > 0;

      if (hasValidCourseData) {
        setCourses(courseData);
        setCourseLoaded(true);
      } else {
        setCourses([]);
        setCourseLoaded(false);
      }
    }
    setLoading(false);
  };

  // When refreshing the loadCourses function is called
  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
    setRefreshing(false);
  };

  // Retrieve student points and level from local storage
  const fetchStudentData = async () => {
    try {
      const fetchedStudent = await getStudentInfo();

      if (fetchedStudent !== null) {
        const studentData = fetchedStudent as StudentInfo;
        setStudentLevel(studentData.level || 0);
        setStudentPoints(studentData.points || 0);
      }
    } catch (error) {
      ShowAlert(errorSwitch(error));
    }
  };

  useEffect(() => {
    // this makes sure loadCourses is called when the screen is focused
    return navigation.addListener("focus", () => {
      void loadCourses();
      void fetchStudentData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation, courses]);

  useEffect(() => {
    const logged = async () => {
      const loggedIn = await AsyncStorage.getItem("loggedIn");
      if (loggedIn) {
        setTimeout(async () => {
          ToastNotification("success", "Logado!");
          await AsyncStorage.removeItem("loggedIn");
        }, 1000);
      }
    };
    try {
      logged();
    } catch (e) {
      ShowAlert(errorSwitch(e));
    }
  }, []);

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />
      {!isOnline ? (
        <OfflineScreen />
      ) : courseLoaded ? (
        <View className="h-full">
          <IconHeader
            title={t("course.welcome-title")}
            description={t("course.welcome-description")}
          />

          {/* Render stats box with level and progress bar only */}
          <View className="px-5">
            <ProfileStatsBox
              level={studentLevel || 0}
              points={studentPoints || 0}
              studyStreak={0}
              leaderboardPosition={0}
              drawProgressBarOnly={true}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} isOnline={isOnline} />
            ))}
          </ScrollView>
        </View>
      ) : (
    <BaseScreen>
      <View className="justify-center px-1 pt-6">
        <Tooltip
          position={{
            top: -150,
            left: 95,
            right: 5,
            bottom: 24,
          }}
          text="Bem-vindo ao Educado! Nesta página central, você encontrará todos os cursos em que está inscrito."
          tailSide="right"
          tailPosition="20%"
          uniqueKey="Courses"
          uniCodeChar="📚"
        />
        <View className="mb-20 mt-14 self-center">
          <Image
            source={require("../../assets/images/logo.png")}
            className="h-[25.54] w-[175.88]"
          />
        </View>
        <View className="justify-center">
          <View className="items-center pt-24">
            <Image source={require("../../assets/images/no-courses.png")} />
            <Text className="text-h2-sm-regular text-center text-[24px] pt-4">
              {t("welcome-page.header")}
            </Text>
            <Text className="text-body-regular text-center px-6 pt-4">
              {t("welcome-page.description")}
            </Text>
          </View>
          <View className="items-center pt-8 px-6">
            <Pressable
              testID={"noCoursesExploreButton"}
              className="flex w-full items-center justify-center bg-surfaceDefaultCyan rounded-2xl p-4"
              onPress={() => navigation.navigate("Explorar")}
            >
              {/* Click to explore courses */}
              <Text className="text-body-bold text-center text-surfaceSubtleGrayscale">
                {t("course.explore-courses")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </BaseScreen>
      )}
    </>
  );
};
export default CourseScreen;
