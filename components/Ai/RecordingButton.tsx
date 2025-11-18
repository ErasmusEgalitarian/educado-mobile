import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
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
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    if (isRecording || audioRecorder.isRecording) {
      return;
    }

    try {
      const { granted } = await requestRecordingPermissionsAsync();

      if (!granted) {
        Alert.alert(
          "Permission Denied",
          "Audio recording permission is required.",
        );
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await audioRecorder.prepareToRecordAsync();

      audioRecorder.record();

      setIsRecording(true);
      onLock?.(true); // Notify parent that recording has started
    } catch (error) {
      console.error("Failed to start recording", error);

      setIsRecording(false);
      onLock?.(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (!audioRecorder.isRecording) {
        setIsRecording(false);
        onLock?.(false);
        return;
      }

      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
        console.error("Recording URI is null");
        setIsRecording(false);
        onLock?.(false);
        return;
      }

      setIsRecording(false);
      console.log("Recording saved at:", uri);

      const result = await sendAudioToChatbot(uri, courses);

      // Notify parent that recording has stopped
      onLock?.(false);

      onAudioResponse(result);
    } catch (error) {
      console.error("Failed to stop recording", error);

      setIsRecording(false);
      onLock?.(false);
    }
  };

  return (
    <TouchableOpacity
      className="ml-2 flex h-7 w-7 items-center justify-center rounded-full bg-surfaceDefaultCyan"
      onPress={() => {
        if (isRecording) {
          void stopRecording();
        } else {
          void startRecording();
        }
      }}
    >
      <MaterialCommunityIcons
        name={isRecording ? "stop" : "microphone"}
        type="material-community"
        color="white"
        size={20}
      />
    </TouchableOpacity>
  );
};
