import { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { BaseScreen } from "@/components/General/BaseScreen";
import IconHeader from "@/components/General/IconHeader";
import { RecordingButton } from "@/components/Ai/RecordingButton";
import FeedbackButtons from "@/components/Ai/FeedbackButtons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import { useAudioPlayer, AudioPlayer, AudioStatus } from "expo-audio";
import * as FileSystem from "expo-file-system";
import { sendMessageToChatbot, getCourses } from "@/api/api";
import { AudioResponse, ChatMessage } from "@/types/ai";
import { Course } from "@/types/course";
import { t } from "@/i18n";
import { colors } from "@/theme/colors";

type PlayingIndex = number | null;

const EduScreen = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<PlayingIndex>(null); // Tracks which audio is playing
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

  const scrollViewRef = useRef<ScrollView | null>(null);
  const player: AudioPlayer = useAudioPlayer();

  const handleAudioResponse = (audioResponse: AudioResponse) => {
    const trimmedUserResponse = audioResponse.message
      .trim()
      .replace(/[\n\s]+$/, "");
    const trimmedAiResponse = audioResponse.aiResponse
      .trim()
      .replace(/[\n\s]+$/, "");

    setChatMessages((previousMessages) => [
      ...previousMessages,
      { sender: "User", text: trimmedUserResponse },
      {
        sender: "Chatbot",
        text: trimmedAiResponse,
        audio: audioResponse.audio,
      },
    ]);
  };

  const handleSendMessage = async () => {
    const userMessageContent = userMessage.trim();

    if (!userMessageContent) {
      return;
    }

    setUserMessage("");
    setChatMessages((previousChatMessages) => [
      ...previousChatMessages,
      { sender: "User", text: userMessageContent },
    ]);
    setLoading(true);

    try {
      const chatbotResponse = await sendMessageToChatbot(userMessage, courses);

      setChatMessages((previousChatMessages) => [
        ...previousChatMessages,
        {
          sender: "Chatbot",
          text: chatbotResponse.message || chatbotResponse.aiResponse || "Ok.",
          audio: chatbotResponse.audio,
        },
      ]);
    } catch (error) {
      const chatbotError =
        error instanceof Error
          ? error.message
          : `${t("edu-screen.unknown-error")}.`;

      setChatMessages((previousChatMessages) => [
        ...previousChatMessages,
        {
          sender: "Chatbot",
          text: chatbotError,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (base64Audio: string, index: number) => {
    try {
      if (currentlyPlaying === index) {
        if (player.playing) {
          console.log("Stopping current sound...");
          player.release();
        }
        setCurrentlyPlaying(null);
        return;
      }

      const audioData = base64Audio.startsWith("data:audio/mpeg;base64,")
        ? base64Audio.split(",")[1]
        : base64Audio;

      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) {
        console.error("Error retrieving audio file");
        return;
      }

      const filePath = `${cacheDir}chatbotResponse.mp3`;

      await FileSystem.writeAsStringAsync(filePath, audioData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (player.playing) {
        player.release();
      }

      player.replace({ uri: filePath });

      player.addListener("playbackStatusUpdate", (status: AudioStatus) => {
        if (!status.isLoaded) {
          player.release();
          setCurrentlyPlaying(null);
        }
      });

      player.play();
      setCurrentlyPlaying(index);
    } catch (error) {
      console.error("Error playing or stopping audio:", error);
      player.release();
      setCurrentlyPlaying(null);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chatMessages, loading]);

  useEffect(() => {
    if (!loading) {
      setLoadingDots("");
    }

    const interval = setInterval(() => {
      setLoadingDots((previousLoadingDots) =>
        previousLoadingDots.length < 3 ? previousLoadingDots + "." : "",
      );
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  const fetchCourses = async () => {
    setCourses([]);

    try {
      const courses = await getCourses();

      const publishedCourses = courses.filter(
        (course) => course.status === "published",
      );

      setCourses(publishedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);

      setCourses([]);
    }
  };

  useEffect(() => {
    void fetchCourses();

    console.log("got courses");
  }, []);

  useEffect(() => {
    return () => {
      player.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BaseScreen className="flex h-screen flex-col">
        <View className="border-b border-borderDarkerGrayscale">
          <IconHeader
            title={"Edu"}
            description={`${t("edu-screen.header")}.`}
          />
        </View>
        <View className="flex-end flex-1">
          <ScrollView ref={scrollViewRef} className="flex-1 pr-2.5">
            {chatMessages.map((message, index) =>
              message.sender === "User" ? (
                <View key={index} className="self-end">
                  <View className="mb-1 mt-2 max-w-[80%] flex-row rounded-t-3xl rounded-bl-3xl bg-surfaceDefaultCyan p-2.5 pl-3">
                    <Text className="text-textTitleGrayscale">
                      {message.text}
                    </Text>
                  </View>
                </View>
              ) : (
                <View key={index} className="flex-row items-center self-start">
                  <View>
                    <View className="mb-1 max-w-[80%] flex-row rounded-t-3xl rounded-br-3xl p-2.5 pl-3">
                      <View className="px-2">
                        <MaterialCommunityIcons
                          name="robot-outline"
                          type="material-community"
                          color="black"
                          size={20}
                        />
                      </View>
                      <View className="w-full">
                        <Markdown>{message.text}</Markdown>
                        <View className="w-max">
                          <FeedbackButtons
                            aiText={message.text}
                            userText={chatMessages[index - 1]?.text || ""}
                          />
                        </View>
                      </View>
                      {message.audio && (
                        <View className="self-center pl-2">
                          <TouchableOpacity
                            onPress={() => {
                              if (message.audio) {
                                void playAudio(message.audio, index);
                              }
                            }}
                            className=""
                          >
                            <MaterialCommunityIcons
                              name={
                                currentlyPlaying === index
                                  ? "stop-circle-outline"
                                  : "play-circle-outline"
                              }
                              type="material-community"
                              color="black"
                              size={32}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ),
            )}
            {loading && (
              <View className="mb-5 self-start p-10">
                <MaterialCommunityIcons
                  name="robot-outline"
                  type="material-community"
                  color="primary_custom"
                  size={20}
                />
                <Text>{`${t("edu-screen.loading")}${loadingDots}`}</Text>
              </View>
            )}
          </ScrollView>
          <View className="m-4 flex-row rounded-3xl border border-textTitleGrayscale bg-surfaceSubtleGrayscale p-1 pl-4">
            <TextInput
              value={userMessage}
              onChangeText={setUserMessage}
              placeholder={t("edu-screen.placeholder")}
              className="flex-1"
              onSubmitEditing={() => void handleSendMessage()}
            />
            {userMessage.trim() ? (
              <TouchableOpacity
                className={`ml-2 flex h-7 w-7 items-center justify-center rounded-full ${loading ? "bg-gray-400" : "bg-primary_custom"}`}
                onPress={() => void handleSendMessage()}
                disabled={loading}
              >
                <MaterialCommunityIcons
                  name="arrow-up"
                  type="material-community"
                  color="white"
                  size={20}
                />
              </TouchableOpacity>
            ) : (
              <RecordingButton
                onAudioResponse={handleAudioResponse}
                onLock={setLoading}
                courses={courses}
              />
            )}
          </View>
        </View>
      </BaseScreen>
    </>
  );
};

export default EduScreen;
