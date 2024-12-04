import React, { useState } from 'react';
import SearchBar from './SearchBar';
import { View, Text, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { categories } from './Categories';
import PropTypes from 'prop-types';

/**
 * FilterNavBar component displays a search bar and a list of categories.
 * @param onChangeText - Callback function called when the text in the search bar changes.
 * @param onCategoryChange - Callback function called when a category is selected.
 * @returns {JSX.Element} - Rendered component
 */
function FilterNavBar({ onChangeText, onCategoryChange, searchPlaceholder }) {
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [searchText, setSearchText] = useState('');

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
				<SearchBar searchText={searchText} onSearchChange={handleSearchInputChange} placeholder={searchPlaceholder} />
			</View>

			<View className=" z-10 pl-2 pr-2 pb-4">
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View className="flex items-center p-2 ">
						<View className="flex-row overflow-x-auto">
							{categories
								.filter((category) => category.label.toLowerCase().includes(searchText.toLowerCase()))
								.map((category) => (
									<Pressable
										key={category.label}
										onPress={() => handleCategorySelect(category.label)}
										className={`${selectedCategory === category.label
											? 'bg-primary_custom'
											: 'border-2'
										} px-2 py-2 rounded-lg border-projectGray border-[1px] mr-2 items-center justify-center`}
									>
										<Text
											className={`${selectedCategory === category.label
												? 'text-projectWhite font-bold'
												: 'text-projectGray'
											}`}
										>{category.label}</Text>
									</Pressable>
								))}
						</View>
					</View>
				</ScrollView>
			</View>

		</View>
	);
}

FilterNavBar.propTypes = {
	onChangeText: PropTypes.func,
	onCategoryChange: PropTypes.func,
	searchPlaceholder: PropTypes.string,
};

export default FilterNavBar;
