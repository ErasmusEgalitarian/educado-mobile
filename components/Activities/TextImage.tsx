import { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { cn } from "@/services/utils";
import RenderHtml from "react-native-render-html";
import {
  Course,
  SectionComponent,
  SectionComponentExercise,
  SectionComponentLecture,
} from "@/types";
import { t } from "@/i18n";
import { useLoginStudent, useStudent } from "@/hooks/query";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingScreen from "@/components/Loading/LoadingScreen";

interface TextImageLectureScreenProps {
  componentList: SectionComponent<
    SectionComponentLecture | SectionComponentExercise
  >[];
  lectureObject: SectionComponentLecture;
  courseObject: Course;
  onContinue: () => Promise<void>;
}

const TextImageLectureScreen = ({
  componentList,
  lectureObject,
  courseObject,
  onContinue,
}: TextImageLectureScreenProps) => {
  const [paragraphs, setParagraphs] = useState<string[] | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const navigation = useNavigation();
  const loginStudent = useLoginStudent();
  const studentQuery = useStudent(loginStudent.data.userInfo.id);

  const isHtml = (content: string) => {
    const htmlRegex = /<\/?[a-z][\s\S]*>/i;
    return htmlRegex.test(content);
  };

  // Split text into paragraphs without cutting words
  const splitText = (text: string) => {
    const tempParagraphs = [];

    if (text.length < 250) {
      tempParagraphs.push(text);
      setParagraphs(tempParagraphs);
      return;
    }

    const findBreakPoint = (str: string, start: number, direction = 1) => {
      let pos = start;
      while (pos > 0 && pos < str.length) {
        if (str[pos] === " ") return pos;
        pos += direction;
      }
      return pos;
    };

    if (text.length <= 250) {
      tempParagraphs.push(text);
    } else {
      const breakPoint1 = findBreakPoint(text, 250);
      tempParagraphs.push(text.substring(0, breakPoint1));

      let remainingText = text.substring(breakPoint1);

      while (remainingText.length > 0) {
        const breakPoint = findBreakPoint(remainingText, 100);
        const chunk = remainingText.substring(0, breakPoint);
        tempParagraphs.push(chunk);
        remainingText = remainingText.substring(breakPoint);
      }
    }

    setParagraphs(tempParagraphs);
  };

  useEffect(() => {
    if (isHtml(lectureObject.content)) {
      setHtmlContent(lectureObject.content);
    } else {
      splitText(lectureObject.content);
    }
  }, [lectureObject.id, lectureObject.content]);

  if (studentQuery.isLoading) {
    return (
      <SafeAreaView>
        <LoadingScreen />
      </SafeAreaView>
    );
  }

  if (studentQuery.isError || !studentQuery.data) {
    console.error(
      `Error occured in TextImage.tsx while fetching the studentQuery: ${studentQuery.error ?? "unknown error"}`,
    );
    navigation.goBack();
    return;
  }

  return (
    <View className="flex-1 bg-surfaceSubtleCyan pt-20">
      <View className="mt-5 flex-col items-center">
        <Text className="text-borderDisabledGrayscale text-caption-sm-semibold">
          {t("course.name") + ": "}
          {courseObject.title}
        </Text>
        <Text className="text-textBodyGrayscale text-body-bold">
          {lectureObject.title}
        </Text>
      </View>

      <View className="w-full flex-1">
        <ScrollView className="max-h-128 mb-4 mt-2 flex-grow px-4">
          {htmlContent ? (
            <RenderHtml
              contentWidth={Dimensions.get("window").width}
              source={{ html: htmlContent }}
              tagsStyles={{
                p: { fontSize: 16, color: "#333" },
                h1: { fontSize: 24, fontWeight: "bold", color: "#000" },
                h2: { fontSize: 20, fontWeight: "bold", color: "#000" },
                // Add more styles as needed
              }}
            />
          ) : (
            paragraphs?.map((paragraph, index) => (
              <Text
                key={index}
                className={cn(
                  "px-4 pt-4 text-lg",
                  index === 0
                    ? "text-primary_custom"
                    : "text-borderDisabledGrayscale",
                )}
              >
                {paragraph}
              </Text>
            ))
          )}
          {paragraphs && paragraphs.length > 2 && (
            <Text className="px-4 text-borderDisabledGrayscale">
              {paragraphs[paragraphs.length - 1]}
            </Text>
          )}
        </ScrollView>
      </View>

      <View className="w-100 mb-[80px] px-6">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-medium bg-surfaceDefaultCyan px-10 py-4"
          onPress={() => void onContinue()}
        >
          <View className="flex-row items-center">
            <Text className="text-center text-surfaceSubtleGrayscale text-body-bold">
              {t("course.continue-button-text")}
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
  );
};

export default TextImageLectureScreen;
