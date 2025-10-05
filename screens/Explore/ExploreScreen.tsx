import { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import FilterNavigationBar from "../../components/Explore/FilterNavigationBar";
import ExploreCard from "../../components/Explore/ExploreCard";
import * as StorageService from "../../services/storage-service";
import { useNavigation } from "@react-navigation/native";
import IconHeader from "../../components/General/IconHeader";
import { shouldUpdate, determineCategory } from "../../services/utils";
import NetworkStatusObserver from "../../hooks/NetworkStatusObserver";
import Tooltip from "../../components/Onboarding/Tooltip";
import OfflineScreen from "../Offline/OfflineScreen";

/**
 * Explore screen displays all courses and allows the user to filter them by category or search text.
 * @returns {JSX.Element} - Rendered component
 */
export default function ExploreScreen() {
  // Search text state
  const [searchText, setSearchText] = useState("");
  // Selected category state
  const [selectedCategory, setSelectedCategory] = useState(null);

  //Sets dummy data for courses (will be replaced with data from backend)
  const [courses, setCourses] = useState([]);
  const [subCourses, setSubCourses] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Asynchronous function that loads the subscribed courses from storage and updates the state.
   * @returns {void}
   */
  async function loadSubscriptions() {
    const subData = await StorageService.getSubCourseList();
    if (shouldUpdate(subCourses, subData)) {
      if (subData.length !== 0 && Array.isArray(subData)) {
        setSubCourses(subData);
      } else {
        setSubCourses([]);
      }
    }
  }

  /**
   * Asynchronous function that loads the courses from storage and updates the state.
   * @returns {void}
   */
  async function loadCourses() {
    const courseData = await StorageService.getCourseList();
    if (shouldUpdate(courses, courseData)) {
      if (courseData.length !== 0 && Array.isArray(courseData)) {
        setCourses(courseData);
      } else {
        setCourses([]);
      }
    }
  }

  // When refreshing the loadCourse and load subscription function is called
  const onRefresh = () => {
    setRefreshing(true);
    loadSubscriptions();
    loadCourses();
    setRefreshing(false);
  };

  useEffect(() => {
    // this makes sure loadcourses is called when the screen is focused
    const update = navigation.addListener("focus", async () => {
      console.log("Explore screen focused");
      loadCourses();
      loadSubscriptions();
    });
    return update;
  }, [navigation, subCourses, selectedCategory, searchText, isOnline]);

  const checkIfSubscribed = (course, subCourses) => {
    for (let subCourse of subCourses) {
      if (subCourse.courseId === course.courseId) {
        return true;
      }
    }
    return false;
  };

  ///---------------------------------------------///

  // Function to filter courses based on searchText or selectedCategory

  const filteredCourses = courses.filter((course) => {
    // Check if the course title includes the search text
    const titleMatchesSearch = course.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    // Check if the course category matches the selected category (or no category is selected)
    const categoryMatchesFilter =
      !selectedCategory ||
      determineCategory(course.category) === selectedCategory;
    // Return true if both title and category conditions are met
    return titleMatchesSearch && categoryMatchesFilter;
  });

  const handleFilter = (text) => {
    setSearchText(text);
    // console.log("handleFilter", searchText);
  };

  const handleCategoryFilter = (category) => {
    //if category label is "all" it will display all courses, otherwise it will display courses with the selected category
    if (category === "Todos") {
      setSelectedCategory(null); // Set selectedCategory to null to show all items
    } else {
      setSelectedCategory(category); // Set selectedCategory to the selected category label
    }
  };

  return (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />

      {!isOnline ? (
        <OfflineScreen />
      ) : (
        <>
          <IconHeader
            title={"Explorar cursos"}
            description={
              "Inscreva-se nos cursos do seu interesse e comece sua jornada"
            }
          />
          <Tooltip
            isVisible={isVisible}
            position={{ top: -360, left: 50, right: 30, bottom: 24 }}
            text={
              "Aqui, você encontrará todos os cursos disponíveis e poderá conhecer e se inscrever facilmente."
            }
            setIsVisible={setIsVisible}
            tailSide="top"
            tailPosition="10%"
            uniqueKey="Explore"
            uniCodeChar="🔍"
          />
          <View height="77%">
            <FilterNavigationBar
              onChangeText={(text) => handleFilter(text)}
              onCategoryChange={handleCategoryFilter}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View className="overflow-y-auto">
                {courses &&
                  filteredCourses &&
                  filteredCourses.map((course, index) => (
                    <ExploreCard
                      key={index}
                      isPublished={course.status === "published"}
                      subscribed={
                        /*isSubscribed[index]*/ checkIfSubscribed(
                          course,
                          subCourses,
                        )
                      }
                      course={course}
                    ></ExploreCard>
                  ))}
              </View>
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
}
