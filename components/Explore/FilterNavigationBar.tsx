import { useState } from "react";
import SearchBar from "./SearchBar";
import { View, Text, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { categories } from "./categories";
import PropTypes from "prop-types";
import colors from "@/theme/colors";

/**
 * FilterNavBar component displays a search bar and a list of categories.
 * @param onChangeText - Callback function called when the text in the search bar changes.
 * @param onCategoryChange - Callback function called when a category is selected.
 * @returns {JSX.Element} - Rendered component
 */
function FilterNavigationBar({
  onChangeText,
  onCategoryChange,
  searchPlaceholder,
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleSearchInputChange = (text) => {
    setSearchText(text);
    onChangeText(text);
  };

  return (
    <View>
      <View className="z-10 p-2">
        <SearchBar
          searchText={searchText}
          onSearchChange={handleSearchInputChange}
          placeholder={searchPlaceholder}
        />
      </View>

      <View className="z-10 pb-4 pl-2 pr-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex items-center p-2">
            <View className="flex-row overflow-x-auto">
              {categories.map((category) => {
                const isSelected = selectedCategory === category.label;
                return (
                  <Pressable
                    key={category.label}
                    onPress={() => handleCategorySelect(category.label)}
                    className="mr-2 items-center justify-center rounded-lg border-[1px] border-projectGray px-2 py-2"
                    style={{
                      backgroundColor: isSelected
                        ? colors.borderDarkerCyan
                        : colors.surfaceSubtleCyan,
                      borderColor: isSelected
                        ? colors.borderDarkerCyan
                        : colors.borderDefaultGrayscale,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected
                          ? colors.textNegativeGrayscale
                          : colors.textCaptionGrayscale,
                        fontFamily: isSelected
                          ? "Montserrat-Bold"
                          : "Montserrat-SemiBold",
                      }}
                    >
                      {category.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

FilterNavigationBar.propTypes = {
  onChangeText: PropTypes.func,
  onCategoryChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
};

export default FilterNavigationBar;
