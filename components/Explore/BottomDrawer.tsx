import colors from "@/theme/colors";
import {
  Modal,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "@/components/General/Text";
import {CardLabel} from "@/components/Explore/CardLabel";
import CustomRating from "@/components/Explore/CustomRating";
import {CourseButton} from "@/components/Explore/CourseButton";
import * as Utility from "@/services/utils";
import { ScrollView } from "react-native-gesture-handler";
import { subscribe, addCourseToStudent } from "@/services/storage-service";
import { useNavigation } from "@react-navigation/native";
import InfoBox from "@/components/Explore/InfoBox";

const BottomDrawer = ({ toggleModal, course, drawerState, subscribed }) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const navigation = useNavigation();

  const subscribeCourse = (course) => {
    toggleModal();
    subscribe(course.courseId);
    addCourseToStudent(course.courseId);
    navigation.navigate("Subscribed", {
      course: course,
    });
  };

  const navigateCourse = (course) => {
    toggleModal();
    navigation.navigate("CourseOverview", {
      course: course,
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={drawerState}
      onRequestClose={() => toggleModal()}
    >
      <View
        className="flex-1"
        style={{
          backgroundColor: colors.surfaceSubtleCyan,
        }}
      />

      <View
        className="flex-start absolute bottom-0 h-full w-full justify-between rounded-t-[40px] bg-surfaceSubtleCyan px-9 py-9 shadow-2xl shadow-black"
        style={{ height: windowHeight * 0.87, width: windowWidth * 1 }}
      >
        <View className="h-8 mb-3 flex-row items-center justify-between">
            <Text className="text-textTitleGrayscale font-sans-semi-bold text-2xl">
              {course.title}
            </Text>
          <TouchableOpacity onPress={() => toggleModal()}>
            <MaterialCommunityIcons
              name={"chevron-down"}
              size={25}
              color={colors.textTitleGrayscale}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-column mb-4">
          <View className="flex-row flex-wrap items-start justify-start pb-2">
            <CardLabel
              title={Utility.determineCategory(course.category)}
              icon={Utility.determineIcon(course.category)}
              color={colors.grayScale}
            />
            <View className="mb-1 w-2.5" />
            <CardLabel
              title={Utility.formatHours(course.estimatedHours)}
              icon={"clock"}
              color={colors.grayScale}
            />
            <View className="mb-1 w-2.5" />
            <CardLabel
              title={Utility.getDifficultyLabel(course.difficulty)}
              icon={"equalizer"}
              color={colors.grayScale}
            />
          </View>

            <View>
              {subscribed ? (
                <View className="mb-1 w-full flex-row">
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={13}
                    color={colors.surfaceDefaultGreen}
                  />
                  <Text className="flex-start pl-1 font-sans-bold text-xs text-surfaceDefaultGreen">
                    Inscrição realizada
                  </Text>
                </View>
              ) : null}
            </View>
            <View className="mb-1 w-2.5" />
            <CustomRating rating={course.rating} />

        </View>

        <View className="border-surfaceDisabledGrayscale w-full border-b-[1px] opacity-50" />

        <ScrollView className="inner-shadow my-4 max-h-24 w-full">
          <Text className="text-base flex-start w-full">{course.description}</Text>
        </ScrollView>

        <View className="pb-5">
          <InfoBox course={course} />
        </View>

        <View className="w-full">
          {subscribed ? (
            <CourseButton course={course} onPress={navigateCourse}>
              <View className="flex-row items-center">
                <Text className="mr-3 py-1 font-sans-bold text-lg text-surfaceSubtleGrayscale">
                  Continuar Curso
                </Text>
                <MaterialCommunityIcons
                  name="play-circle-outline"
                  size={20}
                  color={colors.surfaceSubtleGrayscale}
                />
              </View>
            </CourseButton>
          ) : (
            <CourseButton course={course} onPress={subscribeCourse}>
              <Text className="p-1 font-sans-bold text-lg text-surfaceSubtleGrayscale">
                Inscreva-se agora
              </Text>
            </CourseButton>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BottomDrawer;
