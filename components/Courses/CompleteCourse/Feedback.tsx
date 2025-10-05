import { useState, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwindConfig from "../../../tailwind.config.js";
import PropTypes from "prop-types";
import { getAllFeedbackOptions } from "../../../api/api";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

/* Check the CompleteCourseSlider file in the screens folder for more info */

export default function Feedback({ setFeedbackData }) {
  Feedback.propTypes = {
    setFeedbackData: PropTypes.func.isRequired,
  };

  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackOptions, setFeedbackOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    const fetchFeedbackOptions = async () => {
      try {
        const options = await getAllFeedbackOptions();
        setFeedbackOptions(options);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFeedbackOptions();
  }, []);

  useEffect(() => {
    setFeedbackData({
      rating: selectedRating,
      feedbackOptions: selectedOptions,
      feedbackText: feedbackText,
    });
  }, [selectedRating, selectedOptions, feedbackText]);

  const ratingText = () => {
    switch (selectedRating) {
      case 1:
        return "Muito Ruim";
      case 2:
        return "Ruim";
      case 3:
        return "Neutro";
      case 4:
        return "Bom!";
      case 5:
        return "Muito Bom!";
      default:
        return "";
    }
  };

  const handleStarClick = (index) => {
    const newRating = index + 1;
    setSelectedRating(newRating);
  };

  const handleOptionClick = (optionText) => {
    if (selectedOptions.includes(optionText)) {
      setSelectedOptions(
        selectedOptions.filter((option) => option !== optionText),
      );
    } else {
      setSelectedOptions([...selectedOptions, optionText]);
    }
  };

  const ratingIcons = Array.from({ length: 5 }, (_, index) => ({
    icon: "star",
    color:
      index < selectedRating
        ? tailwindConfig.theme.colors.yellow
        : tailwindConfig.theme.colors.unselectedStar,
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
      <View className="flex w-full items-center px-6">
        <Text className="mt-11 p-4 text-center font-sans-bold text-3xl text-primary_custom">
          Conte o que achou sobre o curso!
        </Text>
        <View className="flex w-full items-center border-b-[1px] border-lightGray py-4">
          <Text className="font-montserrat-bold text-body-large">
            Como você avalia este curso?
          </Text>
          <View className="flex flex-row items-center">
            <Text className="font-montserrat text-sm">
              Escolha de 1 a 5 estrelas para classificar
            </Text>
            <Text className="ml-1 pt-2 text-center text-body text-error">
              *
            </Text>
          </View>

          <View className="w-full flex-row items-center justify-center">
            {ratingIcons.map((icon, index) => (
              <Pressable key={index} onPress={() => handleStarClick(index)}>
                <MaterialCommunityIcons
                  key={index}
                  name={icon.icon}
                  size={52}
                  color={icon.color}
                />
              </Pressable>
            ))}
          </View>
          <Text className="font-montserrat text-caption-medium">
            {ratingText()}
          </Text>
        </View>
        <View className="my-4 flex w-full items-center border-b-[1px] border-lightGray">
          <Text className="font-montserrat-bold text-body-large">
            O que você mais gostou no curso?
          </Text>
          <ScrollView className="my-2 max-h-48">
            <View className="flex-row flex-wrap items-center justify-around p-2">
              {feedbackOptions.map((option, index) => {
                const id = option._id;
                const selected = selectedOptions.includes(id);
                return (
                  <Pressable key={index} onPress={() => handleOptionClick(id)}>
                    <View
                      className={`my-[5px] rounded-lg border-[1px] border-cyanBlue px-2 py-2 ${selected ? "bg-bgprimary_custom" : ""}`}
                    >
                      <Text
                        className={`font-montserrat text-cyanBlue ${selected ? "text-projectWhite" : ""}`}
                      >
                        {option.name}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
        <View className="flex w-full items-center">
          <Text className="font-montserrat-bold text-body-large">
            Deixe um comentário:
          </Text>
          <View className="w-full">
            <TextInput
              className="my-4 h-[100px] w-full rounded-lg border-[1px] border-projectGray p-4 font-montserrat-bold text-top"
              placeholder="Escreva aqui seu feedback"
              placeholderTextColor={"#A1ACB2"}
              onChangeText={(text) => setFeedbackText(text)}
              value={feedbackText}
              multiline
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
