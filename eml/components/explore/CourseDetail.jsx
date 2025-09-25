import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

/**
 * This component is used to display details of a course, such as time investment and difficulty.
 * @param title - The text of the label.
 * @param icon - The icon of the label.
 * @returns {JSX.Element} - Returns a JSX element.
 */
const CourseDetail = ({ title, icon }) => {

    return (
        <View className="flex-row items-center justify-start py-2">
            <MaterialCommunityIcons name={icon} size={20} color="#628397" />
            <Text className="pl-2 text-s text-projectBlack font-sans" >{title}</Text>
        </View>
    );
};

CourseDetail.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
};

export default CourseDetail;
