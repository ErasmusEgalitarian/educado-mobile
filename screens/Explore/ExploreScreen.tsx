import { useEffect, PropsWithChildren, useState } from "react";
import { RefreshControl, ScrollView, View, Text } from "react-native";
import { FilterNavigationBar } from "@/components/Explore/FilterNavigationBar";
import { ExploreCard } from "@/components/Explore/ExploreCard";
import IconHeader from "@/components/General/IconHeader";
import { determineCategory } from "@/services/utils";
import { BaseScreen } from "@/components/General/BaseScreen";
import { t } from "@/i18n";
import {
  useCourses,
  useLoginStudent,
  useSubscribedCourses,
} from "@/hooks/query";
import LoadingScreen from "@/components/Loading/LoadingScreen";
import { Course } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const RecommendationBadge = ({ children }: PropsWithChildren) => {
  return (
    <View>
      <View className="z-10 -mb-5 me-3 self-end overflow-hidden rounded-xl shadow-lg">
        <LinearGradient
          colors={[colors.surfaceLighterCyan, colors.surfaceDefaultCyan]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="px-4 py-2"
        >
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="license" size={12} color="white" />
            <Text className="ml-2 text-surfaceSubtleCyan text-caption-sm-semibold">
              {t("course.best-rating")}
            </Text>
          </View>
        </LinearGradient>
      </View>
      {children}
    </View>
  );
};

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 */
const ExploreScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [recommendedCourse, setRecommendedCourse] = useState<Course>();

  const loginStudentQuery = useLoginStudent();

  const userId = loginStudentQuery.data.userInfo.id;
  const courseQuery = useCourses();
  const subscriptionsQuery = useSubscribedCourses(userId);

  const subscriptions = subscriptionsQuery.data ?? [];
  const refreshing = courseQuery.isFetching || subscriptionsQuery.isFetching;

  const onRefresh = () => {
    void courseQuery.refetch();
    void subscriptionsQuery.refetch();
  };

  const handleFilter = (text: string) => {
    setSearchText(text);
  };

  const handleCategoryFilter = (category: string) => {
    if (category === t("categories.all")) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    const courses = courseQuery.data ?? [];

    if (courses.length === 0) {
      return;
    }

    const filteredCourses = courses.filter((course) => {
      const titleMatchesSearch = course.title
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const categoryMatchesFilter =
        !selectedCategory ||
        determineCategory(course.category) === selectedCategory;

      const isPublished = course.status === "published";

      return titleMatchesSearch && categoryMatchesFilter && isPublished;
    });

    setFilteredCourses(filteredCourses.reverse());
  }, [selectedCategory, searchText, courseQuery.data]);

  useEffect(() => {
    const ratingsList = filteredCourses.map((course) => course.rating);
    const recommendedCourseId = ratingsList.indexOf(Math.max(...ratingsList));
    setRecommendedCourse(filteredCourses[recommendedCourseId]);
  }, [filteredCourses]);

  if (courseQuery.isLoading || subscriptionsQuery.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BaseScreen>
      <View className="overflow-visible px-8 pt-28">
        <IconHeader title={t("course.explore-courses")} />
        <View className="mt-8">
          <FilterNavigationBar
            onChangeText={(text) => {
              handleFilter(text);
            }}
            onCategoryChange={handleCategoryFilter}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View className="mt-8 overflow-visible">
              {recommendedCourse && (
                <RecommendationBadge>
                  <ExploreCard
                    key={recommendedCourse.courseId}
                    subscribed={subscriptions
                      .map((course) => course.courseId)
                      .includes(recommendedCourse.courseId)}
                    course={recommendedCourse}
                  />
                </RecommendationBadge>
              )}
              {filteredCourses
                .filter(
                  (course) => course.courseId !== recommendedCourse?.courseId,
                )
                .map((course, index) => (
                  <ExploreCard
                    key={index}
                    subscribed={subscriptions
                      .map((course) => course.courseId)
                      .includes(course.courseId)}
                    course={course}
                  />
                ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </BaseScreen>
  );
};

export default ExploreScreen;
