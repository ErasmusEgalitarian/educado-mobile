import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { subscribe, addCourseToStudent } from '../../services/StorageService';


/**
 * CourseButton component displays a button to subscribe to or access a course
 * @param course - Course object containing course details
 * @returns {JSX.Element} - Rendered component
 */
const CourseButton = ({ course, onPress, children }) => {

    const navigation = useNavigation();

    return (
        <View className="">
            <Pressable
                onPress={() => onPress(course)}
                className="w-full flex items-center justify-center rounded-2xl bg-surfaceDefaultCyan p-2"
            >
                {children}
            </Pressable>
        </View>
    );
};

CourseButton.propTypes = {
    course: PropTypes.object,
};

export default CourseButton;