import { View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CoursePoints from "@/components/Exercise/CoursePoints";
import { colors } from "@/theme/colors";
import {
  Course,
  LectureType,
  SectionComponent,
  SectionComponentExercise,
  SectionComponentLecture,
} from "@/types";

interface Props {
  courseObject: Course;
  lectureType: LectureType;
  components: SectionComponent<
    SectionComponentLecture | SectionComponentExercise
  >[];
  currentIndex: number;
}

export const ProgressTopBar = ({
  courseObject,
  lectureType,
  components,
  currentIndex,
}: Props) => {
  const navigator = useNavigation();
  const chevronColor =
    lectureType === "video"
      ? colors.surfaceLighterCyan
      : colors.textTitleGrayscale;

  const createCorrectIcon = (index: number, currentIndex: number) => {
    //if lecture is completed show check
    if (index < currentIndex) {
      return (
        <View
          key={index}
          className="mx-1 h-4 w-4 flex-col items-center justify-center rounded-full bg-surfaceDefaultCyan"
        >
          <MaterialCommunityIcons
            name="check-bold"
            size={12}
            color={colors.surfaceLighterCyan}
          />
        </View>
      );
    }
    //if lecture is current indicate with circle
    else if (index === currentIndex) {
      return (
        <View
          key={index}
          className="mx-1 h-4 w-4 flex-col items-center justify-center rounded-full bg-surfaceDefaultCyan opacity-50"
        >
          {/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.primary_custom} /> */}
        </View>
      );
    }
    //if lecture is not current or completed show empty circle
    else if (index > currentIndex) {
      return (
        <View
          key={index}
          className="mx-1 h-3 w-3 flex-col items-center justify-center rounded-full bg-surfaceDisabledGrayscale first-line:opacity-50"
        >
          {/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.secondary} /> */}
        </View>
      );
    }

    //if lecture is completed show check
    if (index < currentIndex) {
      return (
        <View
          key={index}
          className="mx-1 h-5 w-5 flex-col items-center justify-center rounded-full bg-surfaceDefaultCyan"
        >
          <MaterialCommunityIcons
            name="check-bold"
            size={12}
            color={colors.surfaceLighterCyan}
          />
        </View>
      );
    }
    //if lecture is current indicate with circle
    else if (index === currentIndex) {
      return (
        <View
          key={index}
          className="mx-1 h-5 w-5 flex-col items-center justify-center rounded-full bg-surfaceDefaultCyan opacity-50"
        >
          {/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.primary_custom} /> */}
        </View>
      );
    }
    //if lecture is not current or completed show empty circle
    else if (index > currentIndex) {
      return (
        <View
          key={index}
          className="mx-1 h-5 w-5 flex-col items-center justify-center rounded-full bg-surfaceSubtleCyan"
        >
          <MaterialCommunityIcons
            name={index >= components.length ? "check" : "check"}
            size={12}
            color={colors.surfaceSubtleCyan}
          />
        </View>
      );
    }
  };

  return (
    <View className="relative w-full flex-row items-center px-4 pt-[15%]">
      <View className="relative flex-grow flex-row items-center justify-center">
        <Pressable
          onPress={() => {
            navigator.goBack();
          }}
          className=""
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={chevronColor}
          />
        </Pressable>
        <View className="flex-grow flex-row items-center justify-center py-2">
          {components.map((lecture, index) =>
            /* if lecture is completed show check, otherwise empty  */
            createCorrectIcon(index, currentIndex),
          )}
        </View>
        {"text" === lectureType && (
          <CoursePoints courseId={courseObject.courseId} />
        )}
      </View>
    </View>
  );
};
