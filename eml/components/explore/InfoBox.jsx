import React from 'react';
import tailwindConfig from '../../tailwind.config';
import {Modal, View, useWindowDimensions, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Text from '../general/Text';
import CardLabel from './CardLabel';
import CustomRating from './CustomRating';
import CourseButton from './CourseButton';
import * as Utility from '../../services/utilityFunctions';
import InfoBoxItem from './InfoBoxItem';
import {ScrollView} from 'react-native-gesture-handler';
import {subscribe, addCourseToStudent} from '../../services/StorageService';
import {useNavigation} from '@react-navigation/native';

const InfoBox = ({course}) => {
    return (
        <View className="flex-col w-full border border-solid border-grayScale rounded-2xl px-4 py-1">
            <InfoBoxItem
                title={`${Utility.formatHours(course.estimatedHours)} de conteúdo (vídeos,\n exercícios, leituras complementares)`}
                icon="clock-outline"
            />
            <InfoBoxItem
                title={`Curso de Nível ${Utility.getDifficultyLabel(course.difficulty)}`}
                icon="book-multiple-outline"
            />
            <InfoBoxItem
                title="Certificado de Conclusão"
                icon="certificate-outline"
            />
            <InfoBoxItem
                title="Início imediato"
                icon="clock-fast"
            />
            <InfoBoxItem
                title="Acesso total por 1 ano"
                icon="calendar-month-outline"
            />
            <InfoBoxItem
                title="Assista onde e quando quiser! "
                icon="cellphone-link"
                className="mb-0"
            />
        </View>
    )
}

export default InfoBox