import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
/**
 * CustomRating component displays a star rating based on a number
 * @param rating - Number between 0 and 5
 * @returns {JSX.Element} - Rendered component
 */

export interface CustomRatingProps {
  rating?: number;
}

const CustomRating = ({ rating = 0 }: CustomRatingProps) => {
  const [ratingIcons, setRatingIcons] = useState(
    Array(5).fill({
      icon: "star-outline",
      color: colors.surfaceYellow,
    }),
  );
  const [noRating, setNoRating] = useState(false);

  useEffect(() => {
    const fullStars = Math.floor(rating ?? 0);
    const halfStar = rating % 1 !== 0;

    if (rating !== 0) {
      const newRatingIcons = ratingIcons.map((icon, index) => {
        if (index < fullStars) {
          return { icon: "star", color: colors.surfaceYellow };
        } else if (index === fullStars && halfStar) {
          return {
            icon: "star-half-full",
            color: colors.surfaceYellow,
          };
        } else {
          return {
            icon: "star-outline",
            color: colors.surfaceYellow,
          };
        }
      });

      setRatingIcons(newRatingIcons);
    } else {
      setNoRating(true);
    }
  }, [rating]);

  return noRating ? (
    <View className="flex-row items-start justify-start">
      <Text className="pl-1 pt-2 text-sm font-sans text-textDisabledGrayscale">
        Ainda sem avaliações
      </Text>
    </View>
  ) : (
    <View className="flex-row pt-2 items-center justify-start">
      {ratingIcons.map((icon, index) => (
        <MaterialCommunityIcons
          key={index}
          name={icon.icon}
          size={15}
          color={icon.color}
        />
      ))}
      <Text
        className="pl-1 font-sans-bold text-sm"
        style={{ color: colors.surfaceYellow }}
      >
        {rating?.toFixed(1)}
      </Text>
    </View>
  );
};

export default CustomRating;
