import { useState } from "react";
import { ScrollView, View, TouchableOpacity, Text } from "react-native";
import { RadioButton } from "react-native-paper";
import ExerciseInfo from "@/components/Exercise/ExerciseInfo";
import { Icon } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import PopUp from "@/components/Gamification/PopUp";
import { StatusBar } from "expo-status-bar";
import { cn, completeComponent, handleLastComponent } from "@/services/utils";
import { useNavigation } from "@react-navigation/native";
import { Course, Section, SectionComponentExercise } from "@/types";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";

/*
Description:	This screen is displayed when the student is doing an exercise.
				It displays the question and the answers, and the student can select one answer.
				When the student presses the confirm button, the answer is checked and the student is given feedback.
				When the student presses the continue button, the next component is displayed.
				The student can only continue if an answer is selected.
				The student is given 10 points when the answer is correct in the first try,
				otherwise the student gets 5 points when the answer is correct.
				The student gets 0 points when the answer is incorrect or they have completed the exercise before.
Dependencies:	CompSwipeScreen, the screen which contains all the components in the section
Props:			- exerciseObject: The exercise object, which contains the question and the answers
				- sectionObject: The section object, which contains the section title
				- courseObject: The course object, which contains the course title
				- onContinue: A function that is called when the student presses the continue button,
				when the exercise is completed and it is the last component in the section, the student is taken to the section complete screen
*/

interface ExerciseScreenProps {
  componentList: SectionComponentExercise[];
  exerciseObject: SectionComponentExercise;
  sectionObject: Section;
  courseObject: Course;
  onContinue: (isCorrect: boolean) => boolean;
  handleStudyStreak: () => Promise<void>;
}

const ExerciseScreen = ({
  componentList,
  exerciseObject,
  sectionObject,
  courseObject,
  onContinue,
  handleStudyStreak,
}: ExerciseScreenProps) => {
  const navigation = useNavigation();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [buttonText, setButtonText] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isPopUpVisible, setIsPopUpVisible] = useState<boolean>(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(10);
  const [attempts, setAttempts] = useState<number>(0);

  const handleReviewAnswer = async (
    isAnswerCorrect: boolean,
    answerIndex: number,
  ) => {
    setSelectedAnswer(answerIndex);
    if (buttonText === null) {
      setButtonText(t("course.continue-button-text"));
      setShowFeedback(true);
      if (isAnswerCorrect) {
        setIsCorrectAnswer(true);
        setPoints(attempts === 0 ? 10 : 5);
        setIsPopUpVisible(true);
        try {
          await completeComponent(exerciseObject, courseObject.courseId, true);
        } catch (error) {
          console.error("Error completing the exercise:", error);
        }
      } else {
        setIsCorrectAnswer(false);
        setAttempts((prevAttempts) => prevAttempts + 1);
      }
    }
    if (buttonText === t("course.continue-button-text")) {
      setIsPopUpVisible(false);

      const currentLastComponent = componentList[componentList.length - 1];
      const isLastComponent = currentLastComponent.id === exerciseObject.id;

      if (isAnswerCorrect && isLastComponent) {
        try {
          void handleStudyStreak();
          await handleLastComponent(exerciseObject, courseObject, navigation);
        } catch (error) {
          console.error("Error handling last component:", error);
        }
      } else {
        onContinue(isAnswerCorrect);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surfaceSubtleCyan">
      <View className="flex-1 items-center">
        {/* Exercise Information */}
        <View className="text-center">
          <ExerciseInfo
            courseTitle={courseObject.title}
            sectionTitle={sectionObject.title}
          />
        </View>

        {/* Question and Answers */}
        <View className="w-full flex-1 px-6">
          {/* Question Text */}
          <View className="mb-4">
            <Text
              testID="exerciseQuestion"
              className="text-center text-borderDarkerGrayscale text-body-regular"
            >
              {exerciseObject.question}
            </Text>
          </View>

          {/* Answers ScrollView with Fixed Height */}
          <ScrollView className="mb-10 h-60 py-2">
            {exerciseObject.answers.map((answer, index) => (
              <View key={index} className="flex-row items-start pb-6">
                {/* Radio Button */}
                <RadioButton.Android
                  disabled={buttonText === t("course.continue-button-text")}
                  value={String(index)}
                  status={selectedAnswer === index ? "checked" : "unchecked"}
                  onPress={() => void handleReviewAnswer(answer.correct, index)}
                  color={colors.primary_custom}
                  uncheckedColor={colors.primary_custom}
                />

                {/* Answer Text and Feedback */}
                <View className="flex-1">
                  <TouchableOpacity
                    disabled={buttonText === t("course.continue-button-text")}
                    onPress={() =>
                      void handleReviewAnswer(answer.correct, index)
                    }
                    className="flex-1"
                  >
                    <Text className="font-body-regular pb-1 pt-2 text-borderDarkerGrayscale">
                      {answer.text}
                    </Text>
                  </TouchableOpacity>

                  {/* Feedback */}
                  {showFeedback && selectedAnswer === index && (
                    <View
                      className={`w-fit flex-row items-center rounded-medium pb-2 ${
                        answer.correct ? "bg-projectGreen" : "bg-projectRed"
                      }`}
                    >
                      <View className="pl-2 pt-1">
                        <Icon
                          size={10}
                          name={answer.correct ? "check" : "close"}
                          type="material"
                          color={answer.correct ? colors.success : colors.error}
                        />
                      </View>
                      <Text
                        className={cn(
                          "pl-1 pr-2 pt-2 text-caption-medium",
                          answer.correct ? "text-success" : "text-error",
                        )}
                      >
                        {answer.feedback}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Continue Button */}
      <View className="mb-8 w-full px-6">
        <TouchableOpacity
          className={`flex-row items-center justify-center rounded-medium px-10 py-4 ${
            selectedAnswer === null
              ? "bg-primary_custom opacity-60"
              : "bg-primary_custom opacity-100"
          }`}
          onPress={() => {
            if (selectedAnswer !== null) {
              void handleReviewAnswer(
                exerciseObject.answers[selectedAnswer]?.correct,
                selectedAnswer,
              );
            }
          }}
          disabled={selectedAnswer === null} // Prevents interaction when no answer is selected
        >
          <View className="flex-row items-center">
            <Text className="text-center text-surfaceSubtleGrayscale text-body-regular">
              {buttonText ?? t("course.continue-button-text")}
            </Text>
            <Icon
              name="chevron-right"
              type="material"
              size={24}
              color="white"
              className="ml-2"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* PopUp for Feedback */}
      {isPopUpVisible && (
        <PopUp pointAmount={points} isCorrectAnswer={isCorrectAnswer} />
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default ExerciseScreen;
