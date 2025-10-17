import { useState } from "react";
import SearchBar from "@/components/Explore/SearchBar";
import { View, Pressable, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { categories } from "@/components/Explore/categories";
import { colors } from "@/theme/colors";

/**
 * FilterNavBar component displays a search bar and a list of categories.
 * @param onChangeText - Callback function called when the text in the search bar changes.
 * @param onCategoryChange - Callback function called when a category is selected.
 * @returns {JSX.Element} - Rendered component
 */
type FilterNavigationBarProps = {
  onChangeText: (text: string) => void;
  onCategoryChange: (category: string) => void;
  searchPlaceholder?: string;
};

export const FilterNavigationBar = ({
  onChangeText = () => {},
  onCategoryChange = () => {},
  searchPlaceholder,
}: FilterNavigationBarProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSearchInputChange = (text: string) => {
    onChangeText(text);
  };

  const getCategoryItemStyle = (isSelected: boolean) => ({
    backgroundColor: isSelected
      ? colors.borderDarkerCyan
      : colors.surfaceSubtleCyan,
    borderColor: isSelected
      ? colors.borderDarkerCyan
      : colors.borderDefaultGrayscale,
  });

  const getCategoryTextStyle = (isSelected: boolean) => ({
    color: isSelected
      ? colors.textNegativeGrayscale
      : colors.textCaptionGrayscale,
  });

  return (
    <View>
      <View className="z-10">
        <SearchBar
          onSearchChange={handleSearchInputChange}
          placeholder={searchPlaceholder}
        />
      </View>

      <View className="z-10 mt-1 -mr-8">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category.label;
            return (
              <Pressable
                key={category.label}
                onPress={() => handleCategorySelect(category.label)}
                className="mr-2 items-center justify-center rounded-lg border px-3 py-1"
                style={getCategoryItemStyle(isSelected)}
              >
                <Text
                  className="text-s font-montserrat-bold"
                  style={getCategoryTextStyle(isSelected)}
                >
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};
