import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CardLabel from "./CardLabel";
import CustomRating from "./CustomRating";
import * as Utility from "../../services/utils";
import PropTypes from "prop-types";
import colors from "@/theme/colors";
import Text from "../General/Text";
import BottomDrawer from "./BottomDrawer";

/**
 * This component is used to display a course card.
 * @param course - The course object to be displayed.
 * @param isPublished - Boolean value that indicates if the course is published. If false, the card will not be displayed.
 * @param subscribed - Boolean value that indicates if the user is subscribed to the course.
 * @returns {TSX.Element} - Returns a JSX element. If the course is not published, returns null.
 */
export default function ExploreCard({ course, isPublished, subscribed }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleToggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  return isPublished ? (
    <View>
      <View className="mx-4 mb-4 overflow-hidden rounded-lg bg-surfaceSubtleGrayscale p-6 shadow-2xl">
        <View className="flex-col items-center">
          <View className="w-full flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="chart-bar-stacked"
                size={24}
                color="#141B1F"
              />
              <Text className="ml-2 font-montserrat text-[16px] font-bold text-[#141B1F]">
                {course.title}
              </Text>
            </View>
          </View>

          <View className="h-1 w-full border-b-[1px] border-surfaceDisabledGrayscale pt-2 opacity-50"></View>

          <View className="h-[0.5] w-full pt-2" />
          <View className="w-full flex-row items-start justify-between">
            <View className="w-full flex-col items-start justify-between">
              <View className="flex-col items-start justify-start space-y-2 pb-2">
                <CardLabel
                  title={Utility.determineCategory(course.category)}
                  icon={Utility.determineIcon(course.category)}
                />
                <CardLabel
                  title={Utility.formatHours(course.estimatedHours)}
                  icon={"clock-outline"}
                />
                <CardLabel
                  title={Utility.getDifficultyLabel(course.difficulty)}
                  icon={"book-multiple-outline"}
                />
              </View>
              <View className="h-1.25 opacity-50" />
              <CustomRating rating={course.rating} />

              <View className="flex-row justify-end">
                <TouchableOpacity
                  onPress={handleToggleBottomSheet}
                  className="flex-row items-center border-b border-surfaceDefaultCyan px-1 py-0.5"
                >
                  <Text className="mr-1 font-sans-semi-bold text-xs text-surfaceDefaultCyan">
                    saiba mais
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-double-right"
                    color={colors.surfaceDefaultCyan}
                    size={12}
                  />
                </TouchableOpacity>
                <BottomDrawer
                  toggleModal={handleToggleBottomSheet}
                  course={course}
                  drawerState={isBottomSheetOpen}
                  subscribed={subscribed}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  transparentBackground: {
    flex: 1,
    backgroundColor: "rgba(250, 254, 255, 0.5)", // Semi-transparent background
    justifyContent: "flex-end", // Align the modal to the bottom
  },
  modalView: {
    height: "90%",
    width: "100%",
    backgroundColor: colors.surfaceSubtleCyan,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

ExploreCard.propTypes = {
  course: PropTypes.object,
  isPublished: PropTypes.bool,
  subscribed: PropTypes.bool,
};
