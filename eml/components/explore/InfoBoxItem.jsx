import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import tailwindConfig from '../../tailwind.config';

/**
 * This component is used to display details of a course, such as time investment and difficulty.
 * @param title - The text of the label.
 * @param icon - The icon of the label.
 * @returns {JSX.Element} - Returns a JSX element.
 */
const InfoBoxItem = ({ title, icon }) => {

    return (
        <View className="flex-row items-center justify-start py-2">
            <MaterialCommunityIcons name={icon} size={20} color={tailwindConfig.theme.colors.grayScale} />
            <Text className="pl-2 text-s text-projectBlack font-sans" >{title}</Text>
        </View>
    );
};

InfoBoxItem.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
};

export default InfoBoxItem;
