import React from 'react';
import tailwindConfig from '../../tailwind.config';
import {Modal, View, useWindowDimensions, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Text from '../general/Text';
import CardLabel from './CardLabel';
import CustomRating from './CustomRating';
import CourseButton from './CourseButton';
import * as Utility from '../../services/utilityFunctions';
import CourseDetail from './CourseDetail';
import { ScrollView } from 'react-native-gesture-handler';
import { subscribe, addCourseToStudent } from '../../services/StorageService';
import { useNavigation } from '@react-navigation/native';




const BottomDrawer = ({onPress, course, drawerState, subscribed}) => {
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();

    const navigation = useNavigation();

    const subscribeCourse = (course) => {
        onPress(course);
        subscribe(course.courseId);
        addCourseToStudent(course.courseId);
        navigation.navigate('Section', { course });
    };
    
    const navigateCourse = (course) => {
        onPress(course);
        navigation.navigate('Section', { course });
    }
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={drawerState}
            onRequestClose={() => onPress(course)}>

                <View className="flex-1" style={{ backgroundColor: 'rgba(255,255,255,0.5)'}}/>

                <View className="flex-start px-8 py-10 w-full h-full justify-between items-center absolute bottom-0 bg-projectWhite rounded-t-[40px] shadow-2xl shadow-projectBlack" 
                style={{height: windowHeight * 0.87, width: windowWidth * 1}}>
                
                    <View className="flex-column w-full">
                        
                        <View className="flex-row justify-between items-center mb-4"> 
                            <Text className="text-2xl font-sans-semi-bold">{course.title}</Text>
                            <TouchableOpacity onPress={() => onPress(course)}>
                                <MaterialCommunityIcons name={'chevron-down'} size={25} color="#383838"></MaterialCommunityIcons>
                            </TouchableOpacity>	
                        </View>
                            
                        <View className="flex-column mb-4">
                            <View className="flex-column items-start justify-start pb-2 flex-wrap">
                                <CardLabel 
                                    title={Utility.determineCategory(course.category)}
                                    icon={Utility.determineIcon(course.category)}
                                    color="#628397"
                                />
                                <View className="w-2.5 mb-1" />
                                <CardLabel
                                    title={Utility.formatHours(course.estimatedHours)}
                                    icon={'clock'}
                                    color="#628397"
                                />
                                <View className="w-2.5 mb-1" />
                                <CardLabel
                                    title={Utility.getDifficultyLabel(course.difficulty)}
                                    icon={'equalizer'}
                                    color="#628397"
                                />
                                <View className="w-2.5 mb-1" />
                                <View>
                                {
                                    subscribed ? (
                                        <View className="w-full flex-row mb-1">
                                            <MaterialCommunityIcons name="check-circle" size={13} color={tailwindConfig.theme.colors.surfaceDefaultGreen}/>
                                            <Text className="pl-1 text-xs font-sans-bold flex-start text-surfaceDefaultGreen">Inscrição realizada</Text>
                                        </View>
                                        
                                    ) : null
                                }												
                                </View>	
                                <CustomRating rating={course.rating} />
                            </View>
                            

                        </View>

                        <View className="border-b-[1px] w-full border-projectGray opacity-50"></View>								
                    </View>

                    <ScrollView className="w-full max-h-48 py-4 inner-shadow">
                        <Text className="w-full text-m flex-start">{course.description}</Text>
                    </ScrollView>

                    <View className="flex-col w-full border border-solid border-grayScale rounded-2xl px-4 py-1">
                        <CourseDetail
                            title={`${Utility.formatHours(course.estimatedHours)} de conteúdo (vídeos,\n exercícios, leituras complementares)`}
                            icon="clock-outline"
                        />
                        <CourseDetail
                            title={`Curso de Nível ${Utility.getDifficultyLabel(course.difficulty)}`}
                            icon="book-multiple-outline"
                        />
                        <CourseDetail
                            title="Certificado de Conclusão"
                            icon="certificate-outline"
                        />
                        <CourseDetail
                            title="Início imediato"
                            icon="clock-fast"
                        />
                        <CourseDetail
                            title="Acesso total por 1 ano"
                            icon="calendar-month-outline"
                        />
                        <CourseDetail
                            title="Assista onde e quando quiser! "
                            icon="cellphone-link"
                            className="mb-0"
                        />
                    </View>

                    <View className="w-full">
                        {
                            subscribed ? (
                                <CourseButton 
                                    course={course} 
                                    onPress={navigateCourse}>
                                    <View className="flex-row items-center">
                                        <Text className="text-projectWhite py-1 text-lg font-sans-bold mr-3">
                                            Continuar Curso
                                        </Text>
                                        <MaterialCommunityIcons
                                            name="play-circle-outline"
                                            size={20}
                                            color={tailwindConfig.theme.colors.projectWhite}
                                        />
                                    </View>
                                </CourseButton> 
                            ) : (
                                <CourseButton 
                                    course={course} 
                                    onPress={subscribeCourse}>
                                    <Text className="text-projectWhite p-1 text-lg font-sans-bold">
                                        Inscreva-se agora
                                    </Text>
                                </CourseButton>
                            )
                        }
                    </View>
                </View> 
        </Modal>
    )
}

export default BottomDrawer;