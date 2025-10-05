import { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import BaseScreen from "../../components/General/BaseScreen";
import IconHeader from "../../components/General/IconHeader";
import RecordingButton from "../../components/Ai/RecordingButton";
import FeedbackButtons from "../../components/Ai/FeedbackButtons";
import { Icon } from "@rneui/themed";
import Markdown from "react-native-markdown-display";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { sendMessageToChatbot, getCourses } from "../../api/api";

export default function EduScreen() {
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null); // Tracks which audio is playing
  const [currentSound, setCurrentSound] = useState(null); // Stores the current Audio.Sound instance
  const scrollViewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

  const handleAudioResponse = (audioResponse) => {
    const trimmedUserResponse = audioResponse.message
      .trim()
      .replace(/[\n\s]+$/, "");
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { sender: "User", text: trimmedUserResponse },
    ]);
    const trimmedAiResponse = audioResponse.aiResponse
      .trim()
      .replace(/[\n\s]+$/, "");
    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "Chatbot",
        text: trimmedAiResponse,
        audio: audioResponse.audio,
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!userMessage) return;

    setChatMessages([...chatMessages, { sender: "User", text: userMessage }]);
    setLoading(true);
    setUserMessage("");
    const chatbotResponse = await sendMessageToChatbot(userMessage, courses);

    setChatMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "Chatbot",
        text: chatbotResponse.message,
        audio: chatbotResponse.audio,
      },
    ]);

    setLoading(false);
  };

  const playAudio = async (base64Audio, index) => {
    try {
      // Stop the currently playing audio if the same button is clicked
      if (currentlyPlaying === index) {
        if (currentSound) {
          console.log("Stopping current sound...");
          await currentSound.unloadAsync(); // Unload the sound
          setCurrentSound(null); // Clear current sound instance
        }
        setCurrentlyPlaying(null); // Clear currently playing index
        return;
      }

      // Prepare the audio data
      const audioData = base64Audio.startsWith("data:audio/mpeg;base64,")
        ? base64Audio.split(",")[1]
        : base64Audio;

      const filePath = `${FileSystem.cacheDirectory}chatbotResponse.mp3`;
      await FileSystem.writeAsStringAsync(filePath, audioData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Create a new Audio.Sound instance
      const { sound } = await Audio.Sound.createAsync(
        { uri: filePath },
        { shouldPlay: true }, // Start playback immediately
      );

      // Stop and unload any previous sound
      if (currentSound) {
        console.log("Stopping previous sound...");
        await currentSound.unloadAsync();
      }

      setCurrentSound(sound); // Set the new sound instance
      setCurrentlyPlaying(index); // Update the currently playing index

      // Handle playback completion
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync(); // Unload the sound
          setCurrentSound(null);
          setCurrentlyPlaying(null);
        }
      });
    } catch (error) {
      console.error("Error playing or stopping audio:", error);
      // Reset state in case of error
      if (currentSound) {
        await currentSound.unloadAsync();
      }
      setCurrentSound(null);
      setCurrentlyPlaying(null);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages, loading]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots("");
    }
  }, [loading]);

  const fetchCourses = async () => {
    setCourses([]);
    const tempCourses = await getCourses();
    tempCourses.forEach((element) => {
      if (element.status == "published") {
        setCourses((prevCourses) => [
          ...prevCourses,
          {
            title: element.title || "",
            category: element.category || "",
            rating: element.rating || 0,
            description: element.description || "",
            estimatedHours: element.estimatedHours || 0,
            difficulty: element.difficulty || 0,
          },
        ]);
      }
    });
  };

  useEffect(() => {
    fetchCourses();
    console.log("got courses");
  }, []);

  return (
    <>
      <BaseScreen className="flex h-screen flex-col">
        <View
          className="border-b"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <IconHeader
            title={"Edu"}
            description={
              "Meu nome é Edu, e estou aqui para ajudá-lo a navegar neste aplicativo."
            }
          />
        </View>
        <View className="flex-end flex-1">
          <ScrollView ref={scrollViewRef} style={"flex-1"} className="pr-2.5">
            {chatMessages.map((message, index) =>
              message.sender === "User" ? (
                <View key={index} style={{ alignSelf: "flex-end" }}>
                  <View className="mb-1 mt-2 max-w-[80%] flex-row rounded-t-3xl rounded-bl-3xl bg-bgprimary_custom p-2.5 pl-3">
                    <Text className="text-projectLightGray">
                      {message.text}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  key={index}
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <View className="mb-1 max-w-[80%] flex-row rounded-t-3xl rounded-br-3xl p-2.5 pl-3">
                      <View className="px-2">
                        <Icon
                          name="robot-outline"
                          type="material-community"
                          color="black"
                          size={20}
                        />
                      </View>
                      <View className="w-full">
                        <Markdown>{message.text}</Markdown>
                        <View classname="w-max">
                          <FeedbackButtons
                            aiText={message.text}
                            userText={chatMessages[index - 1]?.text || ""}
                          />
                        </View>
                      </View>
                      {message.audio && (
                        <View className="self-center pl-2">
                          <TouchableOpacity
                            onPress={() => playAudio(message.audio, index)}
                            className=""
                          >
                            <Icon
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
              <View
                style={{
                  alignSelf: "flex-start",
                  padding: 10,
                  marginBottom: 5,
                }}
              >
                <Icon
                  name="robot-outline"
                  type="material-community"
                  color="primary_custom"
                  size={20}
                />
                <Text>Edu está pensando{loadingDots}</Text>
              </View>
            )}
          </ScrollView>
          <View className="m-4 flex-row rounded-3xl border border-projectBlack p-1 pl-4">
            <TextInput
              value={userMessage}
              onChangeText={setUserMessage}
              placeholder={"Pesquise aqui..."}
              className="flex-1"
              onSubmitEditing={handleSendMessage}
            />
            {userMessage.trim() ? (
              <TouchableOpacity
                className={`ml-2 flex h-7 w-7 items-center justify-center rounded-full ${loading ? "bg-gray-400" : "bg-primary_custom"}`}
                onPress={loading ? null : handleSendMessage}
                disabled={loading}
              >
                <Icon
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
}
