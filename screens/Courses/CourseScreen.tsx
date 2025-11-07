import { useNavigation } from "@react-navigation/native";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import CourseCard from "@/components/Courses/CourseCard/CourseCard";
import IconHeader from "@/components/General/IconHeader";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import Tooltip from "@/components/Onboarding/Tooltip";
import ProfileStatsBox from "@/components/Profile/ProfileStatsBox";
import { t } from "@/i18n";
import { BaseScreen } from "@/components/General/BaseScreen";
import {
  useLoginStudent,
  useStudent,
  useSubscribedCourses,
} from "@/hooks/query";
import logo from "@/assets/images/logo.png";
import noCourses from "@/assets/images/no-courses.png";
import { SafeAreaView } from 'react-native-safe-area-context'

const CourseScreen = () => {
  const navigation = useNavigation();

  const { data: localStudent } = useLoginStudent();

  const userId = localStudent.userInfo.id;
  const studentQuery = useStudent(userId);
  const subscriptionsQuery = useSubscribedCourses(userId);

  const onRefresh = () => {
    void studentQuery.refetch();
    void subscriptionsQuery.refetch();
  };

  if (studentQuery.isLoading || subscriptionsQuery.isLoading) {
    return <LoadingScreen />;
  }

  const courses = subscriptionsQuery.data ?? [];
  const studentLevel = studentQuery.data?.level ?? 0;
  const studentPoints = studentQuery.data?.points ?? 0;
  const refreshing = studentQuery.isFetching || subscriptionsQuery.isFetching;

  return courses.length > 0 ? (
    <SafeAreaView className="h-full">
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
          <CourseCard key={index} course={course} isOnline={true} />
        ))}
      </ScrollView>
    </SafeAreaView>
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
  );
};
export default CourseScreen;
