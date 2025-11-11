import { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Dimensions, Text } from "react-native";
import { Icon } from "@rneui/themed";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { cn, completeComponent, handleLastComponent } from "@/services/utils";
import RenderHtml from "react-native-render-html";
import { Course, SectionComponentLecture } from "@/types";
import { t } from "@/i18n";
import { fetchLectureImage } from "@/services/storage-service";

interface TextImageLectureScreenProps {
  lectureObject: SectionComponentLecture;
  courseObject: Course;
  isLastSlide: boolean;
  onContinue: () => void;
  handleStudyStreak: () => void;
}

const TextImageLectureScreen = ({
  lectureObject,
  courseObject,
  isLastSlide,
  onContinue,
  handleStudyStreak,
}: TextImageLectureScreenProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [paragraphs, setParagraphs] = useState<string[] | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleContinue = async () => {
    try {
      await completeComponent(lectureObject, courseObject.courseId, true);
      if (isLastSlide) {
        handleStudyStreak();
        await handleLastComponent(lectureObject, courseObject, navigation);
      } else {
        onContinue();
      }
    } catch (error) {
      console.error("Error completing the component:", error);
    }
  };

  useEffect(() => {
    const getLectureImage = async () => {
      try {
        const imageRes = await fetchLectureImage(
          lectureObject.image,
          lectureObject.id,
        );
        setImageUrl(imageRes);
      } catch {
        setImageUrl(null);
      }
    };
    if (lectureObject.image) {
      void getLectureImage();
    }
    if (isHtml(lectureObject.content)) {
      setHtmlContent(lectureObject.content);
    } else {
      splitText(lectureObject.content);
    }
  }, [lectureObject.id, lectureObject.content, lectureObject.image]);

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
          {imageUrl && (
            <View className="h-[25vh] w-full px-4 pt-8">
              <Image source={{ uri: imageUrl }} className="h-full w-full" />
            </View>
          )}
          {paragraphs && paragraphs.length > 2 && (
            <Text className="px-4 text-borderDisabledGrayscale">
              {paragraphs[paragraphs.length - 1]}
            </Text>
          )}
        </ScrollView>
      </View>

      <View className="w-100 mb-8 px-6">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-medium bg-surfaceDefaultCyan px-10 py-4"
          onPress={void handleContinue}
        >
          <View className="flex-row items-center">
            <Text className="text-center text-surfaceSubtleGrayscale text-body-bold">
              {t("course.continue-button-text")}
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
    </View>
  );
};

export default TextImageLectureScreen;
