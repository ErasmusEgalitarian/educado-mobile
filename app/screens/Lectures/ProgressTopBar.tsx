import { View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tailwindConfig from "@/tailwind.config";
import PropTypes from "prop-types";
import CoursePoints from "@/components/Exercise/CoursePoints";

const LectureType = {
  TEXT: "text",
  VIDEO: "video",
};

type ProgressTopBarProps = {
  courseObject?: any;
  lectureType?: string;
  components?: any[];
  currentIndex?: number;
};

const ProgressTopBar = ({
  courseObject,
  lectureType,
  components = [],
  currentIndex = 0,
}: ProgressTopBarProps) => {
  const navigator = useNavigation();
  const chevronColor =
    lectureType === LectureType.VIDEO
      ? tailwindConfig.theme.colors.projectWhite
      : tailwindConfig.theme.colors.projectBlack;

  const createCorrectIcon = (_index: number, _currentIndex: number) => {
    //if lecture is completed show check
    if (
      _index < _currentIndex || components[_index].component?.completed
        ? true
        : false
    ) {
      return (
        <View
          key={_index}
          className="mx-1 h-4 w-4 flex-col items-center justify-center rounded-full bg-primary_custom"
        >
          <MaterialCommunityIcons
            name="check-bold"
            size={12}
            color={tailwindConfig.theme.colors.projectWhite}
          />
        </View>
      );
    }
    //if lecture is current indicate with circle
    else if (_index === _currentIndex) {
      return (
        <View
          key={_index}
          className="mx-1 h-4 w-4 flex-col items-center justify-center rounded-full bg-primary_custom opacity-50"
        >
          {/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.primary_custom} /> */}
        </View>
      );
    }
    //if lecture is not current or completed show empty circle
    else if (_index > _currentIndex) {
      return (
        <View
          key={_index}
          className="mx-1 h-3 w-3 flex-col items-center justify-center rounded-full bg-projectGray first-line:opacity-50"
        >
          {/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.secondary} /> */}
        </View>
      );
    }

    //if lecture is completed show check
    if (_index < _currentIndex || components[_index].completed) {
      return (
        <View
          key={_index}
          className="mx-1 h-5 w-5 flex-col items-center justify-center rounded-full bg-primary_custom"
        >
          <MaterialCommunityIcons
            name="check-bold"
            size={12}
            color={tailwindConfig.theme.colors.projectWhite}
          />
        </View>
      );
    }
    //if lecture is current indicate with circle
    else if (_index === _currentIndex) {
      return (
        <View
          key={_index}
          className="mx-1 h-5 w-5 flex-col items-center justify-center rounded-full bg-primary_custom opacity-50"
        >
          {/* <MaterialCommunityIcons name={_index >= allLectures.length ? "check" : "check"} size={12} color={tailwindConfig.theme.colors.primary_custom} /> */}
        </View>
      );
    }
    //if lecture is not current or completed show empty circle
    else if (_index > _currentIndex) {
      return (
        <View
          key={_index}
          className="mx-1 h-5 w-5 flex-col items-center justify-center rounded-full bg-secondary"
        >
          <MaterialCommunityIcons
            name={_index >= components.length ? "check" : "check"}
            size={12}
            color={tailwindConfig.theme.colors.secondary}
          />
        </View>
      );
    }
  };

  return (
    <View className="relative w-full flex-row items-center px-4 pt-[15%]">
      <View className="relative flex-grow flex-row items-center justify-center">
        <Pressable onPress={() => navigator.goBack()} className="">
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={chevronColor}
          />
        </Pressable>
        <View className="flex-grow flex-row items-center justify-center py-2">
          {components.map((_lecture: any, _index: number) =>
            /* if lecture is completed show check, otherwise empty  */
            createCorrectIcon(_index, currentIndex),
          )}
        </View>
        {LectureType.TEXT === lectureType && (
          <>
            <CoursePoints courseId={courseObject.courseId} />
          </>
        )}
      </View>
    </View>
  );
};

ProgressTopBar.propTypes = {
  courseObject: PropTypes.object,
  lectureType: PropTypes.string,
  components: PropTypes.array,
  currentIndex: PropTypes.number,
};

export default ProgressTopBar;
