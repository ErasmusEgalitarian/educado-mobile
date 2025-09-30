import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { sendAudioToChatbot } from "../../api/api";
import { Icon } from "@rneui/themed";
import PropTypes from "prop-types";

export default function RecordingButton({ onAudioResponse, onLock, courses }) {
  const [recording, setRecording] = useState(null);

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
        setRecording(null);

        console.log("Recording saved at:", uri);

        // Send the audio to the chatbot
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
      <Icon
        name="microphone"
        type="material-community"
        color="white"
        size={20}
      />
    </TouchableOpacity>
  );
}

RecordingButton.propTypes = {
  onAudioResponse: PropTypes.func, // Must be a function and is required
  onLock: PropTypes.func, // Optional function
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      category: PropTypes.string,
      rating: PropTypes.number,
      description: PropTypes.string,
      estimatedHours: PropTypes.number,
      difficulty: PropTypes.number,
    }),
  ),
};
