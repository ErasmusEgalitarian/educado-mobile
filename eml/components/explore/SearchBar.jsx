import React from 'react';
import { TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

/**
 * This component is used to display a search bar.
 * @param searchText - The current search text.
 * @param onSearchChange - Callback function called when the search text changes. It receives the updated search text as an argument.
 * @param placeholder - The placeholder text for the search bar.
 * @returns {JSX.Element} - Returns a JSX element.
 */
function SearchBar({ onSearchChange, placeholder }) {
	return (
		<View className="flex-row items-center relative bg-projectWhite border-searchbar border-[1px] rounded-medium px-4 mb-2.5 mx-2.5">
			<TextInput
				placeholder={placeholder}
				onChangeText={onSearchChange}
				className="flex-1 py-1 pr-35 font-sans-semi-bold text-sm text-grayScale"
				placeholderTextColor="#628397"
			/>
			<MaterialCommunityIcons name="magnify" size={16} color="#4E6879" />
		</View>
	);
}

SearchBar.propTypes = {
	onSearchChange: PropTypes.func,
	placeholder: PropTypes.string,
};

export default SearchBar;
