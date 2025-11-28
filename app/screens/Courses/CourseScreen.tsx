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
import { t } from "@/i18n";
import { BaseScreen } from "@/components/General/BaseScreen";
import {
  useLoginStudent,
  useStudent,
  useSubscribedCourses,
} from "@/hooks/query";
import logo from "@/assets/images/logo.png";
import noCourses from "@/assets/images/no-courses.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { LevelProgress } from "@/components/Profile/LevelProgress";

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

  const levelProgressPercentage = studentPoints % 100;
  const pointsToNextLevel = 100 - levelProgressPercentage;

  return courses.length > 0 ? (
    <SafeAreaView className="h-full">
      <IconHeader
        title={t("course.welcome-title")}
        description={t("course.welcome-description")}
      />
      <View className="p-7">
        <View className="rounded-xl border border-borderDefaultGrayscale p-4">
          <LevelProgress
            levelProgressPercentage={levelProgressPercentage}
            level={studentLevel}
          />
          <View className="flex flex-row flex-wrap items-center">
            <Text className="text-textLabelCyan text-caption-sm-regular">
              {t("profile.level_message", { points: pointsToNextLevel })} {"🥳"}
            </Text>
          </View>
        </View>
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
            top: 190,
            left: 100,
          }}
          tailSide="right"
          tailPosition={12}
          tooltipKey="Courses"
          uniCodeIcon="📚"
        >
          <Text className="text-body-bold">
            {t("welcome-page.tutorial-heading")}
          </Text>
          <Text className="text-body-regular">
            {t("welcome-page.tutorial-body")}
          </Text>
          <Text className="text-body-bold">
            {t("welcome-page.tutorial-body-bold")}
          </Text>
          <Text className="text-body-regular">.</Text>
        </Tooltip>
        <View className="mb-20 mt-20 self-center pt-16">
          <Image source={logo} className="h-[25.54] w-[175.88]" />
        </View>
        <View className="justify-center">
          <View className="items-center pt-16">
            <Image source={noCourses} />
            <Text className="pt-4 text-center text-h2-sm-regular">
              {t("welcome-page.header")}
            </Text>
            <Text className="px-6 pt-4 text-center text-body-regular">
              {t("welcome-page.description")}
            </Text>
          </View>
          <View className="items-center px-6 pt-8">
            <Pressable
              testID={"noCoursesExploreButton"}
              className="flex w-full items-center justify-center rounded-2xl bg-surfaceDefaultCyan p-4"
              onPress={() => {
                // @ts-expect-error Will be refactored when we move to Expo Router
                navigation.navigate("Explorar");
              }}
            >
              {/* Click to explore courses */}
              <Text className="text-center text-surfaceSubtleGrayscale text-body-bold">
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
