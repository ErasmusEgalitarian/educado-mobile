import { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import FilterNavigationBar from "@/components/Explore/FilterNavigationBar";
import { ExploreCard } from "@/components/Explore/ExploreCard";
import { getCourseList, getSubCourseList } from "@/services/storage-service";
import { useNavigation } from "@react-navigation/native";
import IconHeader from "@/components/General/IconHeader";
import { shouldUpdate, determineCategory } from "@/services/utils";
import NetworkStatusObserver from "@/hooks/NetworkStatusObserver";
import OfflineScreen from "@/screens/Offline/OfflineScreen";
import { Course } from "@/types/course";
import { BaseScreen } from "@/components/General/BaseScreen";

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 * @returns {JSX.Element} - Rendered component
 */
export const ExploreScreen = () => {
  // Hooks for updating data and states
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [subCourses, setSubCourses] = useState<Set<string>>(new Set());
  const [isOnline, setIsOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  /**
   * Loads courses and updates React state variables ´courses´ and ´subCourses´.
   *
   * @async
   * @returns {Promise<void>} State is updated, nothing is returned.
   */
  const loadCourses = async (): Promise<void> => {
    const [courseData, subData] = await Promise.all([
      getCourseList(),
      getSubCourseList(),
    ]);

    if (shouldUpdate(courses, courseData)) {
      setCourses(
        Array.isArray(courseData) && courseData.length ? courseData : [],
      );
    }

    if (Array.isArray(subData) && subData.length) {
      setSubCourses(new Set(subData.map((sub) => sub.courseId)));
    } else {
      setSubCourses(new Set());
    }
  };

  useEffect(() => {
    return navigation.addListener("focus", async () => {
      console.log("Explore screen focused");
      await loadCourses();
    });
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const handleFilter = (text: string) => {
    setSearchText(text);
  };

  const handleCategoryFilter = (category: string) => {
    if (category === "Todos") {
      setSelectedCategory(""); // Set selectedCategory to null to show all items
    } else {
      setSelectedCategory(category); // Set selectedCategory to the selected category label
    }
  };

  /**
   * Filters courses to match search query or selected category
   *
   * @returns {boolean} true if there are any matching results
   */
  const filteredCourses = courses.filter((course) => {
    const titleMatchesSearch = course.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const categoryMatchesFilter =
      !selectedCategory ||
      determineCategory(course.category) === selectedCategory;
    return titleMatchesSearch && categoryMatchesFilter;
  });

  return (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />

      {!isOnline ? (
        <OfflineScreen />
      ) : (
        <BaseScreen>
          <View className="overflow-visible px-8 pt-28">
            <IconHeader title={"Explorar cursos"} />
            <View className="mt-8">
              <FilterNavigationBar
                onChangeText={(text) => handleFilter(text)}
                onCategoryChange={handleCategoryFilter}
              />
              <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View className="mt-8 overflow-visible">
                  {filteredCourses.reverse().map((course, index) => (
                    <ExploreCard
                      key={index}
                      isPublished={course.status === "published"}
                      subscribed={subCourses.has(course.courseId)}
                      course={course}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </BaseScreen>
      )}
    </>
  );
};
