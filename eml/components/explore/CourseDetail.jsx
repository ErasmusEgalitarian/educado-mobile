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
        <View className="flex-row items-center justify-start">
            <MaterialCommunityIcons name={icon} size={13} color="#628397" />
            <Text className="pl-1 text-xs text-projectBlack" >{title}</Text>
        </View>
    );
};

CourseDetail.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
};

export default CourseDetail;
