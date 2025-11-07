import { colors } from "@/theme/colors";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CardLabel } from "@/components/Explore/CardLabel";
import { CustomRating } from "@/components/Explore/CustomRating";
import { CourseButton } from "@/components/Explore/CourseButton";
import * as Utility from "@/services/utils";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { InfoBox } from "@/components/Explore/InfoBox";
import { Course } from "@/types";
import { t } from "@/i18n";
import { useLoginStudent, useSubscribeToCourse } from "@/hooks/query";

export interface BottomDrawerProps {
  toggleModal: () => void;
  course: Course;
  drawerState: boolean;
  subscribed: boolean;
}

const styles = StyleSheet.create({
  shadow: { elevation: 10 },
});

export const BottomDrawer = ({
  toggleModal,
  course,
  drawerState,
  subscribed,
}: BottomDrawerProps) => {
  const navigation = useNavigation();

  const localStudentQuery = useLoginStudent();
  const subscribeToCourseQuery = useSubscribeToCourse();

  const subscribeToCourse = () => {
    toggleModal();

    subscribeToCourseQuery.mutate({
      userId: localStudentQuery.data.userInfo.id,
      courseId: course.courseId,
    });

    // @ts-expect-error Will be refactored when we move to Expo Router
    navigation.navigate("Subscribed", { course: course });
  };

  const navigateCourse = () => {
    toggleModal();
    // @ts-expect-error Will be refactored when we move to Expo Router
    navigation.navigate("CourseOverview", { course: course });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={drawerState}
      onRequestClose={() => {
        toggleModal();
      }}
    >
      <View className="flex-1 bg-surfaceSubtleCyan opacity-50" />

      <View
        className="flex-start absolute bottom-0 h-[91%] w-full justify-between rounded-t-[40px] bg-surfaceSubtleCyan p-9"
        style={styles.shadow}
      >
        <View className="h-9 flex-row items-center justify-between">
          <Text className="mr-2 text-textTitleGrayscale text-h2-sm-regular">
            {course.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
            }}
          >
            <MaterialCommunityIcons
              name={"chevron-down"}
              size={28}
              color={colors.textTitleGrayscale}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-column">
          <View className="flex-column flex-wrap items-start justify-start pb-2">
            <CardLabel
              title={Utility.determineCategory(course.category)}
              icon={Utility.determineIcon(course.category)}
              font="text-caption-sm-regular"
              color="textCaptionGrayscale"
            />
            <View className="mb-1 w-2.5" />
            <CardLabel
              title={Utility.formatHours(course.estimatedHours)}
              icon={"clock"}
              font="text-caption-sm-regular"
              color="textCaptionGrayscale"
            />
            <View className="mb-1 w-2.5" />
            <CardLabel
              title={Utility.getDifficultyLabel(course.difficulty)}
              icon={"equalizer"}
              font="text-caption-sm-regular"
              color="textCaptionGrayscale"
            />
          </View>

          <View>
            {subscribed ? (
              <View className="w-full flex-row items-center">
                <MaterialCommunityIcons
                  name="check-circle"
                  size={13}
                  color={colors.surfaceDefaultGreen}
                />
                <Text className="flex-start pl-1 text-surfaceDefaultGreen text-caption-sm-regular">
                  {t("course.registered")}
                </Text>
              </View>
            ) : null}
          </View>
          <CustomRating rating={course.rating} />
        </View>

        <View className="w-full border-b-[1px] border-surfaceDisabledGrayscale opacity-50" />

        <ScrollView className="inner-shadow my-4 max-h-40 w-full">
          <Text className="flex-start w-full text-h4-sm-regular">
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
                <Text className="mr-3 py-1 text-surfaceSubtleGrayscale text-h4-sm-bold">
                  {t("course.continue")}
                </Text>
                <MaterialCommunityIcons
                  name="play-circle-outline"
                  size={20}
                  color={colors.surfaceSubtleGrayscale}
                />
              </View>
            </CourseButton>
          ) : (
            <CourseButton course={course} onPress={subscribeToCourse}>
              <Text className="p-1 text-surfaceSubtleGrayscale text-h4-sm-bold">
                {t("course.signup")}
              </Text>
            </CourseButton>
          )}
        </View>
      </View>
    </Modal>
  );
};
