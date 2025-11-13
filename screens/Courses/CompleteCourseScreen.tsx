import { useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Text,
} from "react-native";
import CompleteCourseSlider from "@/components/Courses/CompleteCourse/CompleteCourseSlider";
import { useNavigation, useRoute } from "@react-navigation/native";
import { giveFeedback } from "@/api/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/*
Description: 	This screen is displayed when the student completes a course.
				The screen dispalys three slides. The first slide displays a congratulation message and an animation.
				The second slide displays a circular progress bar, which shows the percentage of exercises completed in the first try.
				The third slide displays the certificate gained by completing the course.
				When the student presses the continue button, the student is taken to the next slide.
				On the last slide, the student is taken to the home screen when the student presses the continue button.
Dependencies: 	The student must have the course in their course list.
*/

const CompleteCourseScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const completeCourseSliderRef = useRef<{
    scrollBy: (offset: number) => void;
  } | null>(null);
  const [feedbackData, setFeedbackData] = useState<{ rating?: number }>({});
  const [feedbackError, setFeedbackError] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { course } = route.params as { course: { courseId: string } };
  const isFeedbackScreen = currentSlide === 1;
  const rating = feedbackData.rating ? feedbackData.rating : 0;
  const onFBScreenNoStars = isFeedbackScreen && rating === 0;

  // Generate certificate for the student, Uncomment this when course completion is properly handled or to test certificates
  /* useEffect(() => {
		const CreateCertificate = async () => {
			const student = await getStudentInfo();
			const user = await getUserInfo();
			try {
				await generateCertificate(course.courseId, student, user);

			} catch (error) {
				console.log(error);
			}
		};

		CreateCertificate();
	}, []); */

  const handleIndexChange = (index: number) => {
    setCurrentSlide(index);
  };
  const handleSubmitFeedback = async () => {
    try {
      await giveFeedback(course.courseId, feedbackData);
    } catch (e: unknown) {
      if ((e as { response?: { status: number } })?.response?.status === 404) {
        setFeedbackError(true);
      }
    }
  };

  const handleNextSlide = async () => {
    if (!completeCourseSliderRef.current) {
      return;
    }

    if (isFeedbackScreen) {
      await handleSubmitFeedback();
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeStack" }] as never,
      });
    } else {
      completeCourseSliderRef.current.scrollBy(1);
    }
  };

  // Show alert when feedback error occurs
  if (feedbackError) {
    Alert.alert(
      "Não foi possível encontrar o curso sobre o qual você deu feedback.",
    );
  }

  return (
    <SafeAreaView className="bg-secondary">
      <View className="flex h-full w-full flex-col items-center justify-around">
        <View className="flex h-5/6 w-screen items-center justify-center">
          <CompleteCourseSlider
            {...({
              setFeedbackData,
              onIndexChanged: handleIndexChange,
              ref: completeCourseSliderRef,
              courseObject: course,
            } as Record<string, unknown>)}
          />
        </View>

        <View className="w-full px-6">
          <TouchableOpacity
            className={`flex-row items-center justify-center rounded-medium bg-primary_custom px-10 py-4 ${
              onFBScreenNoStars ? "opacity-50" : ""
            }`}
            onPress={() => {
              !onFBScreenNoStars && handleNextSlide();
            }}
            disabled={onFBScreenNoStars}
          >
            <View className="flex-row items-center">
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {isFeedbackScreen ? "Enviar e concluir" : "Continuar"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                type="material"
                size={24}
                color="white"
                className="ml-2"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// TypeScript types are handled through the route params interface

export default CompleteCourseScreen;
