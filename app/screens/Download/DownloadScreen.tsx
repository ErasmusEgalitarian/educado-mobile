import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Text from "@/components/General/Text";
import * as StorageService from "@/services/storage-service";
import BackButton from "@/components/General/BackButton";
import CourseCard from "@/components/Courses/CourseCard/CourseCard";
import IconHeader from "@/components/General/IconHeader";
import { shouldUpdate } from "@/services/utils";
import ToastNotification from "@/components/General/ToastNotification";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import NetworkStatusObserver from "@/hooks/NetworkStatusObserver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import errorSwitch from "@/components/General/error-switch";
import ShowAlert from "@/components/General/ShowAlert";

/**
 * Profile screen
 * @returns {React.Element} Component for the profile screen
 */
export default function DownloadScreen() {
  const [courseLoaded, setCourseLoaded] = useState(false);
  const [downloadedCourses, setDownloadedCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  async function loadCourses() {
    // Get all the downloaded courses for a user
    const downloadedCoursesData = await StorageService.getAllCoursesLocally();

    if (shouldUpdate(downloadedCourses, downloadedCoursesData)) {
      if (
        downloadedCoursesData.length !== 0 &&
        Array.isArray(downloadedCoursesData)
      ) {
        // normalize the data because of the difference in structure between the downloaded courses and the courses from the server
        const normalizedDownloadedCourses = downloadedCoursesData.map(
          (course) => ({
            ...course,
            courseId: course._id, // Map `_id` to `courseId`
          }),
        );

        // Filter out expired courses and delete them
        const validCourses = normalizedDownloadedCourses.filter((course) => {
          const isExpired = isDownloadedCourseExpired(course);
          if (isExpired) {
            // Delete expired course
            StorageService.deleteLocallyStoredCourse(course.courseId);
          }
          return !isExpired; // Only keep valid courses
        });

        setDownloadedCourses(validCourses); // Only set non-expired courses
        setCourseLoaded(validCourses.length > 0);
      } else {
        setCourseLoaded(false);
      }
    }

    // Finally set loading to false
    setLoading(false);
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadCourses();
    setRefreshing(false);
  };

  useEffect(() => {
    // this makes sure loadCourses is called when the screen is focused
    return navigation.addListener("focus", () => {
      loadCourses();
    });
  }, [navigation]);

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

  function isDownloadedCourseExpired(course) {
    const currentDate = new Date();
    const courseDate = new Date(course.dateOfDownload);
    // Calculate the difference in milliseconds
    const diffInMilliseconds = currentDate - courseDate;

    // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);

    // Return true if the course is older than 30 days
    return diffInDays > 30;
  }

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />
      <SafeAreaView className="bg-secondary">
        {courseLoaded ? (
          <View height="100%">
            <View className="flex-row items-center">
              <View className="flex-1">
                <BackButton
                  onPress={() => navigation.navigate("ProfileHome")}
                />
              </View>
              <View className="flex-1">
                <IconHeader title="Downloads" />
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {downloadedCourses.map((course, index) => (
                <CourseCard
                  key={index}
                  course={course}
                  isOnline={isOnline}
                ></CourseCard>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="mt-20 items-center justify-center bg-secondary">
            <Text className="text-white text-center text-2xl">
              Nenhum curso disponível
            </Text>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
