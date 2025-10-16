import colors from "@/theme/colors";
import {
  Modal,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "@/components/General/Text";
import { CardLabel } from "@/components/Explore/CardLabel";
import CustomRating from "@/components/Explore/CustomRating";
import { CourseButton } from "@/components/Explore/CourseButton";
import * as Utility from "@/services/utils";
import { ScrollView } from "react-native-gesture-handler";
import { subscribe, addCourseToStudent } from "@/services/storage-service";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import InfoBox from "@/components/Explore/InfoBox";
import type { Course } from "@/types/course";

export interface BottomDrawerProps {
  toggleModal: () => void;
  course: Course;
  drawerState: boolean;
  subscribed: boolean;
}

type BottomDrawerNavParams = {
  Subscribed: { course: Course };
  CourseOverview: { course: Course };
};

const BottomDrawer = ({
  toggleModal,
  course,
  drawerState,
  subscribed,
}: BottomDrawerProps) => {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const navigation = useNavigation<NavigationProp<BottomDrawerNavParams>>();

  const subscribeCourse = (course: Course) => {
    toggleModal();
    subscribe(course.courseId);
    addCourseToStudent(course.courseId);
    navigation.navigate("Subscribed", {
      course: course,
    });
  };

  const navigateCourse = (course: Course) => {
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
          opacity: 0.5
        }}
      />

      <View
        className="flex-start absolute bottom-0 h-full w-full justify-between rounded-t-[40px] bg-surfaceSubtleCyan px-9 py-9 shadow-2xl shadow-black"
        style={{ height: windowHeight * 0.87, width: windowWidth * 1 }}
      >
        <View className="h-9 mr-6 flex-row items-center justify-between">
          <Text className="font-sans-semi-bold text-3xl text-textTitleGrayscale mr-2">
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

        <View className="flex-column">
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
                <Text className="flex-start pl-1 font-sans-bold text-s text-surfaceDefaultGreen">
                  Inscrição realizada
                </Text>
              </View>
            ) : null}
          </View>
          <View className="mb-1 w-2.5" />
          <CustomRating rating={course.rating} />
        </View>

        <View className="w-full border-b-[1px] border-surfaceDisabledGrayscale opacity-50" />

        <ScrollView className="inner-shadow my-4 max-h-24 w-full">
          <Text className="flex-start w-full text-base">
            {course.description}
          </Text>
        </ScrollView>

        <View className="pb-5">
          <InfoBox course={course} />
        </View>

        <View className="w-full">
          {subscribed ? (
            <CourseButton course={course} onPress={navigateCourse}>
              <View className="flex-row items-center">
                <Text className="mr-3 py-1 font-sans-bold text-xl text-surfaceSubtleGrayscale">
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
              <Text className="p-1 font-sans-bold text-xl text-surfaceSubtleGrayscale">
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
