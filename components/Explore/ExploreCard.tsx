// @ts-nocheck
import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwindConfig from "../../tailwind.config.js";
import Text from "../General/Text";
import CardLabel from "./CardLabel";
import CustomRating from "./CustomRating";
import BottomDrawer from "./BottomDrawer.js";
import * as Utility from "../../services/utils";
import PropTypes from "prop-types";

/**
 * This component is used to display a course card.
 * @param course - The course object to be displayed.
 * @param isPublished - Boolean value that indicates if the course is published. If false, the card will not be displayed.
 * @param subscribed - Boolean value that indicates if the user is subscribed to the course.
 * @returns {JSX.Element|null} - Returns a JSX element. If the course is not published, returns null.
 */
export default function ExploreCard({ course, isPublished, subscribed }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleToggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  return isPublished ? (
    <View className="mx-4 mb-4 overflow-hidden rounded-lg bg-surfaceSubtleCyan p-6 shadow-sm shadow-black">
      <View className="flex-col items-center">
        <View className="w-full flex-row items-center justify-normal">
          <MaterialCommunityIcons
            name="chart-bar-stacked"
            size={24}
            color={tailwindConfig.theme.colors.textTitle}
          />

          <Text className="font-sans-bold text-base text-textTitle">
            {course.title}
          </Text>
        </View>

        <View className="h-1 w-full border-b-[1px] border-surfaceDisabled pt-2 opacity-50"></View>

        <View className="h-[0.5] w-full pt-2" />
        <View className="w-full flex-row items-start justify-between">
          <View className="flex-col items-start justify-between">
            <View className="flex-column flex-wrap items-start justify-start pb-2">
              <CardLabel
                title={Utility.determineCategory(course.category)}
                icon={Utility.determineIcon(course.category)}
                color={tailwindConfig.theme.colors.grayScale}
              />
              <View className="mb-1 w-2.5" />
              <CardLabel
                title={Utility.formatHours(course.estimatedHours)}
                icon={"clock"}
                color={tailwindConfig.theme.colors.grayScale}
              />
              <View className="mb-1 w-2.5" />
              <CardLabel
                title={Utility.getDifficultyLabel(course.difficulty)}
                icon={"equalizer"}
                color={tailwindConfig.theme.colors.grayScale}
              />
            </View>
            <View className="h-1.25 opacity-50" />
            <CustomRating rating={course.rating} />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between px-1 py-7">
        <Text className="text-m text-textTitle">{course.description}</Text>
      </View>

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
            color={tailwindConfig.theme.colors.surfaceDefaultCyan}
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

      <View className="absolute items-start">
        <View className="rotate-[315deg] items-center">
          {subscribed ? (
            <Text className="-left-8 -top-4 bg-surfaceYellow px-8 text-xs font-bold text-surfaceSubtle drop-shadow-sm">
              Inscrito
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  ) : null;
}

ExploreCard.propTypes = {
  course: PropTypes.object,
  isPublished: PropTypes.bool,
  subscribed: PropTypes.bool,
};
