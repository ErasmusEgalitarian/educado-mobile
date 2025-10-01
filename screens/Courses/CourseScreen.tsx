import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import Text from "../../components/General/Text";
import * as StorageService from "../../services/storage-service";
import CourseCard from "../../components/Courses/CourseCard/CourseCard";
import IconHeader from "../../components/General/IconHeader";
import { shouldUpdate } from "../../services/utils";
import ToastNotification from "../../components/General/ToastNotification";
import LoadingScreen from "../../components/Loading/LoadingScreen";
import NetworkStatusObserver from "../../hooks/NetworkStatusObserver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import errorSwitch from "../../components/General/error-switch";
import ShowAlert from "../../components/General/ShowAlert";
import Tooltip from "../../components/Onboarding/Tooltip";
import { getStudentInfo } from "../../services/storage-service";
import ProfileStatsBox from "../../components/Profile/ProfileStatsBox";
import OfflineScreen from "../Offline/OfflineScreen";

/**
 * Course screen component that displays a list of courses.
 * @component
 * @returns {JSX.Element} The course screen component.
 */
export default function CourseScreen() {
  const [courses, setCourses] = useState([]);
  const [courseLoaded, setCourseLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentLevel, setStudentLevel] = useState(0);
  const [studentPoints, setStudentPoints] = useState(0);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Asynchronous function that loads the courses from storage and updates the state.
   * @returns {void}
   */
  async function loadCourses() {
    const courseData = await StorageService.getSubCourseList();
    if (shouldUpdate(courses, courseData)) {
      if (courseData.length !== 0 && Array.isArray(courseData)) {
        setCourses(courseData);
        setCourseLoaded(true);
      } else {
        setCourses([]);
        setCourseLoaded(false);
      }
    }
    setLoading(false);
  }

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
        setStudentLevel(fetchedStudent.level);
        setStudentPoints(fetchedStudent.points);
      }
    } catch (error) {
      ShowAlert(errorSwitch(error));
    }
  };

  useEffect(() => {
    // this makes sure loadCourses is called when the screen is focused
    return navigation.addListener("focus", () => {
      loadCourses();
      fetchStudentData();
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

  return loading ? (
    <LoadingScreen />
  ) : (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />
      {!isOnline ? (
        <OfflineScreen />
      ) : courseLoaded ? (
        <View height="100%">
          <IconHeader
            title="Bem Vindo!"
            description="Aqui você encontra todos os cursos em que você está inscrito!"
          />

          {/* Render stats box with level and progress bar only */}
          <View className="px-5">
            <ProfileStatsBox
              level={studentLevel || 0}
              points={studentPoints || 0}
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
        <View className="items-center justify-center bg-secondary">
          <Tooltip
            isVisible={isVisible}
            position={{
              top: -150,
              left: 95,
              right: 5,
              bottom: 24,
            }}
            setIsVisible={setIsVisible}
            text="Bem-vindo ao Educado! Nesta página central, você encontrará todos os cursos em que está inscrito."
            tailSide="right"
            tailPosition="20%"
            uniqueKey="Courses"
            uniCodeChar="📚"
          />
          <View className="pb-16 pt-24">
            <Image
              source={require("../../assets/images/logo.png")}
              className="items-center justify-center"
            />
          </View>

          <View className="items-center justify-center gap-10 py-10">
            <View className="h-auto w-full items-center justify-center px-10">
              <Image source={require("../../assets/images/no-courses.png")} />
              <Text className="pb-4 pt-4 text-center font-sans-bold text-subheading leading-[29.26] text-projectBlack">
                Comece agora
              </Text>
              <Text className="text-center font-montserrat text-body text-projectBlack">
                Você ainda não se increveu em nenhum curso. Acesse a página
                Explore e use a busca para encontrar cursos do seu interesse.
              </Text>
            </View>
            <View>
              <Pressable
                testID="exploreButton"
                className="rounded-r-8 h-auto w-full items-center justify-center rounded-md bg-primary_custom px-20 py-4"
                onPress={() => navigation.navigate("Explorar")}
              >
                <Text className="text-center font-sans-bold text-body text-projectWhite">
                  Explorar cursos
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
