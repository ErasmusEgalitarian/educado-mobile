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
import { Course } from "@/types/index";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const RecommendationBadge = ({ children }: PropsWithChildren) => {
  return (
    <View className="relative my-3">
      <View className="absolute -top-3 right-3 z-10 overflow-hidden rounded-xl shadow-lg">
        <LinearGradient
          colors={[colors.surfaceLighterCyan, colors.surfaceDefaultCyan]}
          locations={[0, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="px-4 py-2"
        >
          <Text className="font-caption-sm-semibold text-surfaceSubtleCyan">
            <MaterialCommunityIcons name="license" size={12} color="white" />
            {"  " + t("course.best-rating")}
          </Text>
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

      return titleMatchesSearch && categoryMatchesFilter;
    });

    setFilteredCourses(filteredCourses);
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
                    isPublished={recommendedCourse.status === "published"}
                    subscribed={subscriptions
                      .map((course) => course.courseId)
                      .includes(recommendedCourse.courseId)}
                    course={recommendedCourse}
                  />
                </RecommendationBadge>
              )}
              {filteredCourses.reverse().map((course, index) => (
                <ExploreCard
                  key={index}
                  isPublished={course.status === "published"}
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
