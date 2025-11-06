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
import {
  useLoginStudent,
  useStudent,
  useSubscribedCourses,
} from "@/hooks/query";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "@/assets/images/logo.png";
import noCourses from "@/assets/images/no-courses.png";

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
    <SafeAreaView className="items-center justify-center bg-surfaceSubtleGrayscale">
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
      <View className="pb-16 pt-24 shadow-md">
        <Image source={logo} className="items-center justify-center" />
      </View>

      <View className="items-center justify-center gap-10 py-10">
        <View className="h-auto w-full items-center justify-center px-10">
          <Image source={noCourses} />
          <Text className="pb-4 pt-4 text-textTitleGrayscale text-h2-sm-regular">
            {t("course.get-started")}
          </Text>
          <Text className="text-center text-textTitleGrayscale text-body-regular">
            {t("course.no-courses-message")}
          </Text>
        </View>
        <View>
          <Pressable
            testID="exploreButton"
            className="rounded-r-8 h-auto w-full items-center justify-center rounded-md bg-surfaceDefaultCyan px-20 py-4"
            onPress={() => {
              // @ts-expect-error Will be refactored when we move to Expo Router
              navigation.navigate("Explorar");
            }}
          >
            <Text className="text-center text-textNegativeGrayscale text-body-bold">
              {t("course.explore-courses")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CourseScreen;
