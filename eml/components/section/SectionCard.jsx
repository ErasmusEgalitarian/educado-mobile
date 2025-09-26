import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '../general/Text';
import PropTypes from 'prop-types';


/**
 * A component that displays a section card with collapsible content.
 * @param {Number} progress - The progress containing the student's progress.
 * @param {Number} numOfEntries - How many total entries are there
 * @param {string} title - Title of the card
 * @param {Function} onPress - The callback function to navigate
 * @param {boolean} disabled - Is the card disabled
 * @param {string} icon - Non disabled icon
 * @param {string} disabledIcon
 * @param {boolean} disableProgressNumbers - Disable the progression numbers
 * @returns {JSX.Element} - The SectionCard component.
 */
export default function SectionCard({ numOfEntries, title, progress, onPress, disabled, icon, disabledIcon, disableProgressNumbers }) {
	disableProgressNumbers = disableProgressNumbers === undefined ? false : disableProgressNumbers;
	const isComplete = progress === numOfEntries ;
	const inProgress = 0 < progress && progress < numOfEntries;
	const progressText = isComplete ? 'Concluído' : inProgress ? 'Em progresso' : 'Não iniciado';
	const progressTextColor = isComplete ? 'text-success' : 'text-cyanBlue';
	disabledIcon = disabledIcon ? disabledIcon : 'lock-outline';


	return (
		<View>
			<TouchableOpacity
				className={`bg-secondary rounded-lg box-shadow-lg shadow-opacity-[1] mb-[15] mx-[18] overflow-hidden elevation-[8] ${disabled ? 'bg-disabled' : ''}`}
				onPress={onPress}
				disabled={disabled}
			>
				<View className="flex-row items-center justify-between px-[25] py-[15]">
					<View>
						<Text className="text-[16px] font-montserrat text-projectBlack mb-2">
							{title}
						</Text>

						<View className="flex-row items-center">
							<Text className={`text-[14px] font-montserrat ${progressTextColor}`}>
								{ disableProgressNumbers ? '' : progress + '/' +numOfEntries + ' '}
								{ progressText}
							</Text>
						</View>
					</View>
					{ disabled ? (
						<MaterialCommunityIcons
							testID="chevron-right"
							name={disabledIcon}
							size={25}
							color="gray"
						/>
					) : (
						<MaterialCommunityIcons
							testID="chevron-right"
							name={icon}
							size={25}
							color="gray"
						/>
					)
					}
				</View>
			</TouchableOpacity>
			
		</View>
	);
}
