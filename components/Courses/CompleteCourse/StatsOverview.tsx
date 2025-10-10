import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, Dimensions, Image } from "react-native";
import Text from "../../General/Text";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Easing } from "react-native-reanimated";
import { getStudentInfo } from "../../../services/storage-service";
import { findCompletedCourse } from "../../../services/utils";
import PropTypes from "prop-types";

/* Check the CompleteCourseSlider file in the screens folder for more info */

const StatsOverview = forwardRef(({ courseObject }, ref) => {
  StatsOverview.propTypes = {
    courseObject: PropTypes.object.isRequired,
  };

  const [percentage, setPercentage] = useState(0);
  const circleSize = Dimensions.get("window").height * 0.25;
  const tailwindConfig = require("../../../tailwind.config.js");
  const projectColors = tailwindConfig.theme.colors;
  const circularProgressRef = useRef(null);

  StatsOverview.displayName = "StatsOverview";

  async function getPercentage() {
    try {
      const completedCourse = findCompletedCourse(
        await getStudentInfo(),
        courseObject.courseId,
      );
      let totalExercises = 0;
      let totalExercisesWithFirstTry = 0;

      if (completedCourse) {
        for (let section of completedCourse.sections) {
          for (let comp of section.components) {
            if (comp.compType === "exercise") {
              totalExercises++;
              if (comp.isFirstAttempt) {
                totalExercisesWithFirstTry++;
              }
            }
          }
        }
      } else {
        return 0;
      }

      return Math.round((totalExercisesWithFirstTry / totalExercises) * 100);
    } catch (error) {
      console.error("Error fetching completed courses:", error);
      return 0;
    }
  }

  const startAnimation = () => {
    circularProgressRef.current?.animate(percentage, 1250, Easing.quad);
  };

  useImperativeHandle(ref, () => ({
    startAnimation,
  }));

  useEffect(() => {
    getPercentage().then((percentage) => {
      setPercentage(percentage);
    });
  }, []);

  return (
    <View className="flex h-full w-full items-center justify-start">
      <Text className="font-sans-bold mb-14 p-4 text-center text-3xl text-primary_custom">
        Veja suas estatísticas do curso
      </Text>

      <View className="m-5 w-full items-center">
        <AnimatedCircularProgress
          ref={circularProgressRef}
          fill={0}
          size={circleSize}
          width={7.5}
          rotation={0.25}
          tintColor={projectColors.primary_custom}
          backgroundColor={projectColors.projectWhite}
        >
          {() => (
            <Text className="font-sans-bold text-center text-2xl text-primary_custom">
              {percentage}%
            </Text>
          )}
        </AnimatedCircularProgress>
        <Text className="px-10 pt-10 text-center text-lg text-projectBlack">
          Você respondeu {percentage}% correta, bravo!
        </Text>
      </View>

      <Text className="font-sans-bold mb-3 text-center text-lg text-projectBlack">
        Placar Educado
      </Text>

      <View className="w-screen px-6">
        <View className="flex h-14 flex-row items-center justify-between rounded-full bg-lightGray px-2">
          <View className="flex flex-row items-center">
            <Image
              source={require("../../../assets/images/profileEX.jpg")}
              alt="arrow-right"
              className="h-10 w-10 rounded-full"
            />
            <Text className="font-sans-bold ml-3 text-center text-lg text-projectWhite">
              Hans Zimmer
            </Text>
          </View>
          <Text className="font-sans-bold text-center text-lg text-projectWhite">
            1099
          </Text>
        </View>
      </View>

      <View className="z-10 -mt-3 w-screen px-6">
        <View className="flex h-14 flex-row items-center justify-between rounded-full bg-primary_custom px-2">
          <View className="flex flex-row items-center">
            <Image
              source={require("../../../assets/images/profileEX.jpg")}
              alt="arrow-right"
              className="h-10 w-10 rounded-full"
            />
            <Text className="font-sans-bold ml-3 text-center text-lg text-projectWhite">
              Hans Zimmer
            </Text>
          </View>
          <Text className="font-sans-bold text-center text-lg text-projectWhite">
            1100
          </Text>
        </View>
      </View>

      <View className="-mt-3 w-screen px-6">
        <View className="flex h-14 flex-row items-center justify-between rounded-full bg-lightGray px-2">
          <View className="flex flex-row items-center">
            <Image
              source={require("../../../assets/images/profileEX.jpg")}
              alt="arrow-right"
              className="h-10 w-10 rounded-full"
            />
            <Text className="font-sans-bold ml-3 text-center text-lg text-projectWhite">
              Hans Zimmer
            </Text>
          </View>
          <Text className="font-sans-bold text-center text-lg text-projectWhite">
            1101
          </Text>
        </View>
      </View>
    </View>
  );
});

export default StatsOverview;
