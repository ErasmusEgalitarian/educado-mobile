import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { sendAudioToChatbot } from "@/api/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AudioResponse } from "@/types/ai";
import { Course } from "@/types/course";

export interface RecordingButtonProps {
  onAudioResponse: (audioResponse: AudioResponse) => void;
  onLock?: (isLocked: boolean) => void;
  courses: Course[];
}

export const RecordingButton = ({
  onAudioResponse,
  onLock,
  courses,
}: RecordingButtonProps) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Audio recording permission is required.",
        );

        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingInstance = new Audio.Recording();

      await recordingInstance.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      await recordingInstance.startAsync();

      setRecording(recordingInstance);

      if (onLock) {
        onLock(true); // Notify parent that recording has started
      }
    } catch (error) {
      console.error("Failed to start recording", error);

      if (onLock) {
        onLock(false);
      }
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        if (!uri) {
          console.error("Recording URI is null");

          return;
        }

        setRecording(null);

        console.log("Recording saved at:", uri);

        const result = await sendAudioToChatbot(uri, courses);

        // Notify parent that recording has stopped
        if (onLock) {
          onLock(false);
        }

        onAudioResponse(result);
      }
    } catch (error) {
      console.error("Failed to stop recording", error);

      if (onLock) {
        onLock(false);
      }
    }
  };

  return (
    <TouchableOpacity
      className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary_custom"
      onPressIn={startRecording}
      onPressOut={stopRecording}
    >
      <MaterialCommunityIcons
        name="microphone"
        type="material-community"
        color="white"
        size={20}
      />
    </TouchableOpacity>
  );
};
