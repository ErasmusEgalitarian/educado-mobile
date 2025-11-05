import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";
import type { Icon } from "@/types";

/**
 * CustomRating component displays a star rating based on a number
 * @param rating - Number between 0 and 5
 * @returns {JSX.Element} - Rendered component
 */

export interface CustomRatingProps {
  rating?: number;
}

export const CustomRating = ({ rating = 0 }: CustomRatingProps) => {
  const [ratingIcons, setRatingIcons] = useState<
    { icon: Icon; color: string }[]
  >([]);
  const [noRating, setNoRating] = useState(false);

  useEffect(() => {
    if (rating === 0) {
      setNoRating(true);
      setRatingIcons([]);
      return;
    }
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    const iconMap: { full: Icon; half: Icon; empty: Icon } = {
      full: "star",
      half: "star-half-full",
      empty: "star-outline",
    };

    const newRatingIcons = [...Array(5).keys()].map((index) => {
      const icon: Icon =
        index < fullStars
          ? iconMap.full
          : index === fullStars && halfStar
            ? iconMap.half
            : iconMap.empty;

      return { icon, color: colors.surfaceYellow };
    });

    setRatingIcons(newRatingIcons);
  }, [rating]);

  return noRating ? (
    <View className="flex-row items-start justify-start">
      <Text className="pl-1 pt-2 text-textDisabledGrayscale text-caption-sm-regular">
        {t("no-reviews")}
      </Text>
    </View>
  ) : (
    <View className="flex-row items-center justify-start pt-2">
      {ratingIcons.map((icon, index) => (
        <MaterialCommunityIcons
          key={index}
          name={icon.icon}
          size={15}
          color={icon.color}
        />
      ))}
      <Text
        className="pl-1 text-caption-sm-semibold"
        style={{ color: colors.surfaceYellow }}
      >
        {rating.toFixed(1)}
      </Text>
    </View>
  );
};
