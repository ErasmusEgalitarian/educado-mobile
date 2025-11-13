import { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { sendFeedbackToBackend } from "../../api/api";
import PropTypes from "prop-types";

const FeedbackButtons = ({ aiText, userText }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const handleFeedback = async (type) => {
    setSelectedFeedback(type); // Update UI state to show the selected feedback

    try {
      // Call the API function
      const result = await sendFeedbackToBackend(userText, aiText, type);
      if (result.success) {
        console.log("Feedback sent successfully!");
      } else {
        console.error("Error sending feedback:", result.error);
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  return (
    <View className="flex-row justify-start">
      {selectedFeedback === null && (
        <>
          <TouchableOpacity
            onPress={() => handleFeedback(true)}
            className="mr-1"
          >
            <MaterialCommunityIcons
              name="thumb-up-outline"
              type="material-community"
              color="black"
              size={18}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleFeedback(false)}>
            <MaterialCommunityIcons
              name="thumb-down-outline"
              type="material-community"
              color="black"
              size={18}
            />
          </TouchableOpacity>
        </>
      )}
      {selectedFeedback === true && (
        <MaterialCommunityIcons
          name="thumb-up"
          type="material-community"
          color="#166276"
          size={18}
        />
      )}
      {selectedFeedback === false && (
        <MaterialCommunityIcons
          name="thumb-down"
          type="material-community"
          color="#166276"
          size={18}
        />
      )}
    </View>
  );
};

// Define prop types
FeedbackButtons.propTypes = {
  aiText: PropTypes.string.isRequired, // aiText must be a string and is required
  userText: PropTypes.string.isRequired, // userText must be a string and is required
};

export default FeedbackButtons;
