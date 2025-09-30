import React from 'react';
import tailwindConfig from '../../tailwind.config';
import {Modal, View, useWindowDimensions, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Text from '../general/Text';
import CardLabel from './CardLabel';
import CustomRating from './CustomRating';
import CourseButton from './CourseButton';
import * as Utility from '../../services/utilityFunctions';
import CourseDetail from './InfoBoxItem';
import {ScrollView} from 'react-native-gesture-handler';
import {subscribe, addCourseToStudent} from '../../services/StorageService';
import {useNavigation} from '@react-navigation/native';

const CourseWelcome = () => {
    return (
        <Modal
            visible={confirmationState}
        >
            
        </Modal>
    )
}

export default CourseWelcome;