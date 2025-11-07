import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
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

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 */
const ExploreScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

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
