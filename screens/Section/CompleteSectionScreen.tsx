import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import StandardButton from "@/components/General/StandardButton";
import AnimatedNumbers from "@/components/Gamification/AnimatedNumber";
import { generateSectionCompletePhrases } from "@/constants/phrases";
import { getStudentInfo } from "@/services/storage-service";
import { findCompletedSection, isCourseCompleted } from "@/services/utils";
import { Course } from "@/types";
import Animation from "@/assets/animations/completeSection.json";

/*
Description: 	This screen is displayed when the student completes a section.
				It displays the points earned in the section, an animation, and a button to continue.
				The button will take the student to the section overview.
				The points earned are retrieved from the student model (in the field courses.sections) in the database,
				which are stored in async storage when logging in.
Dependencies: 	Routes which in this case are the whole course object and the sectionId
*/

interface Props {
  route: {
    params: {
      parsedCourse: Course;
      sectionId: string;
    };
  };
}

export default function CompleteSectionScreen({ route }: Props) {
  const parsedCourse = route.params.parsedCourse;
  const sectionId = route.params.sectionId;
  const [points, setPoints] = useState(0);
  const [extraPoints, setExtraPoints] = useState(0);
  const navigation = useNavigation();
  const [randomPhrase, setRandomPhrase] = useState("");

  const getRandomPhrase = () => {
    const phrases = generateSectionCompletePhrases();

    const randomIndex = Math.floor(Math.random() * phrases.length);

    return phrases[randomIndex];
  };
  useEffect(() => {
    setRandomPhrase(getRandomPhrase());
  }, []);

  const animation = (
    state: number,
    setState: Dispatch<SetStateAction<number>>,
    finalValue: number,
  ) => {
    return new Promise((resolve) => {
      if (state < finalValue) {
        const interval = setInterval(() => {
          setState((prevNumber) => {
            const nextNumber = prevNumber + 1;
            if (nextNumber >= finalValue) {
              clearInterval(interval);
              resolve(finalValue);
              return finalValue;
            }
            return nextNumber;
          });
        });
      } else {
        resolve(finalValue);
      }
    });
  };

  const pointBox = (
    text: string,
    pointsText: number,
    color: string,
    duration: number,
  ) => {
    return (
      <View
        className={`h-24 w-40 ${color === "green" ? "bg-success" : "bg-yellow"} items-center justify-between rounded-lg px-2 pb-2 shadow shadow-projectGray`}
      >
        <View className="h-2/5 w-full justify-center">
          <Text className="text-center text-textNegativeGrayscale text-body-bold">
            {text}
          </Text>
        </View>
        <View className="h-3/5 w-full items-center justify-center rounded bg-surfaceLighterCyan">
          <AnimatedNumbers
            animateToNumber={pointsText}
            animationDuration={duration}
            fontStyle={`text-body-bold ${color === "green" ? "text-success" : "text-yellow"} text-center`}
          />
        </View>
      </View>
    );
  };

  const handleAllSectionsCompleted = async () => {
    const studentInfo = await getStudentInfo();

    if (isCourseCompleted(studentInfo)) {
      navigation.reset({
        index: 1,
        routes: [
          // @ts-expect-error will be fixed after expo upgrade
          { name: "HomeStack" },
          {
            // @ts-expect-error will be fixed after expo upgrade
            name: "CourseOverview",
            params: { course: parsedCourse },
          },
        ],
      });
    }
  };

  useEffect(() => {
    const getPointsFromSection = async () => {
      try {
        const studentInfo = await getStudentInfo();

        const completedSection = findCompletedSection(
          studentInfo,
          parsedCourse.courseId,
          sectionId,
        );
        if (completedSection === undefined) {
          return 0;
        }
        return {
          totalPoints: completedSection.totalPoints,
          extraPoints: completedSection.extraPoints,
        };
      } catch (error) {
        console.log(error);
        return 0;
      }
    };
    const animations = async () => {
      const obj = await getPointsFromSection();
      await animation(points, setPoints, obj === 0 ? obj : obj.totalPoints);

      const id = setTimeout(() => {
        animation(
          extraPoints,
          setExtraPoints,
          obj === 0 ? obj : obj.extraPoints,
        ).catch(() => {
          console.error("Could not play animations");
        });
      }, 750);
      return () => {
        clearInterval(id);
      };
    };

    let clearTimer: (() => void) | undefined;

    // Call the async function without 'await'
    animations()
      .then((clear) => {
        clearTimer = clear;
      })
      .catch(() => {
        console.error("Could not play animations");
      });

    // Return the cleanup function for useEffect
    return () => {
      if (clearTimer) {
        clearTimer();
      }
    };
  }, [points, extraPoints, sectionId, parsedCourse.courseId]);

  return (
    <SafeAreaView className="flex h-screen w-screen flex-col items-center justify-center bg-surfaceLighterCyan">
      <View className="absolute top-0 z-10 w-full">
        <LottieView source={Animation} autoPlay />
      </View>

      <View className="absolute bottom-0 z-20 h-3/4 w-full items-center justify-end px-6">
        <View className="mb-8 h-40 w-fit justify-center">
          <Text className="bg-surfaceLighterCyan text-center text-textLabelCyan text-body-bold">
            {randomPhrase}
          </Text>
        </View>

        <View className="mb-20 flex w-full flex-row justify-center">
          {pointBox("Pontos", points, "yellow", 750)}

          {/* Extra Points Box for next year <3 */}
          {/* {pointBox('Pontos Extras', extraPoints, 'green', 750)} */}
        </View>

        <View className="mb-20 w-full">
          <StandardButton
            props={{
              buttonText: "Continuar",
              onPress: async () => {
                await handleAllSectionsCompleted();
              },
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
