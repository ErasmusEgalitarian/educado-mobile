import { useState, useEffect } from "react";
import { View, Animated, Easing, Dimensions } from "react-native";
import Text from "../General/Text";
import {
  generateSuccessPhrases,
  generateEncouragementPhrases,
} from "../../constants/popup-phrases";
import { getUserInfo } from "../../services/storage-service";
import PropTypes from "prop-types";
import { getPointsFromExerciseSender } from "../events/sender-events";

/* 
Description:	This component displays a pop up with a random phrase and the amount of points the student has earned.
				This component is placed in the exercise screen.
				When the pop up is displayed, an event is triggered to the course points component.
Denpendencies: 	The student must be in a exercise.
Props: 			pointAmount - The amount of points the student has earned from the exercise.
				isCorrectAnswer - A boolean that is true if the student answered correctly, and false if not.

*/

// sender of event

export default function PopUp({ pointAmount, isCorrectAnswer }) {
  const screenWidth = Dimensions.get("window").width;
  const animatedPopUpValue = new Animated.Value(0);
  const animatedPointValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(1);
  const [randomPhrase, setRandomPhrase] = useState("");
  const pointTimer = 3000;

  const getRandomPhrase = (firstName) => {
    let randomIndex = 0;

    const phrases = isCorrectAnswer
      ? generateSuccessPhrases(firstName)
      : generateEncouragementPhrases(firstName);

    randomIndex = Math.floor(Math.random() * phrases.length);
    let randomPhrase = phrases[randomIndex];
    if (randomPhrase.length > 69) {
      randomPhrase = randomPhrase.substring(0, 69) + "...";
    }

    return randomPhrase;
  };

  const fetchUserFirstName = async () => {
    const userInfo = await getUserInfo();
    return userInfo.firstName;
  };

  const customEasing = (value) => {
    // Adjust these parameters to control the easing effect
    const power = 2; // Determines the rate of change. Higher values result in a faster initial acceleration.
    const factor = 2; // A factor to adjust the curve
    const delay = 5; // Delay factor for slower start

    return (
      Math.pow(delay + (1 - delay) * value, power) /
      (Math.pow(delay + (1 - delay) * value, power) +
        Math.pow(factor - factor * (delay + (1 - delay) * value), power))
    );
  };

  const startPopUpAnimation = () => {
    Animated.timing(animatedPopUpValue, {
      toValue: 1,
      duration: 250,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        hidePopup();
      }, 5000); // Hide after 5 seconds
    });
  };

  const hidePopup = () => {
    Animated.timing(animatedPopUpValue, {
      toValue: 0,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const startPointAnimation = () => {
    Animated.parallel([
      Animated.timing(animatedPointValue, {
        toValue: 8,
        duration: pointTimer,
        easing: (value) => customEasing(value),
        useNativeDriver: false,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: pointTimer,
        easing: (value) => customEasing(value),
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(() => {}, pointTimer);
    });
  };

  useEffect(() => {
    fetchUserFirstName().then((firstName) => {
      setRandomPhrase(getRandomPhrase(firstName));
    });

    setTimeout(() => {
      getPointsFromExerciseSender(pointAmount);
    }, pointTimer);
  }, []);

  startPopUpAnimation();
  startPointAnimation();

  return (
    <>
      {/* Pop Up */}
      <Animated.View
        style={{
          opacity: animatedPopUpValue, // Apply the animated value to opacity
          transform: [
            {
              translateY: animatedPopUpValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0], // Adjust the values for the desired effect
              }),
            },
          ],
        }}
        className="absolute bottom-0 z-20 h-[12.5%] w-screen flex-row justify-between rounded-large bg-bgprimary_custom p-4 shadow-md shadow-projectBlack"
        testID={"PopUp"}
      >
        <View className={`${isCorrectAnswer === true ? "w-10/12" : "w-full"}`}>
          <Text
            testID={"Phrase"}
            className={`font-sans-bold text-sm ${isCorrectAnswer === true ? "text-correctAnswer" : "text-wrongAnswer"}`}
          >
            {randomPhrase}
          </Text>
        </View>

        {isCorrectAnswer === true ? (
          <Text
            testID={"Xp"}
            className="font-sans-bold text-sm text-correctAnswer"
          >
            {pointAmount}pts
          </Text>
        ) : null}
      </Animated.View>

      {/* XP Animation */}
      <Animated.View
        style={{
          opacity: animatedPointValue,
          transform: [
            {
              translateY: animatedPointValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0], // Adjust the values for the desired effect
              }),
            },
            {
              translateX: screenWidth / 2 - 40,
            },
          ],
        }}
        className="absolute bottom-0 z-20 h-[12.5%] w-screen shadow-md shadow-projectBlack"
        testID={"XpPopUp"}
      >
        {isCorrectAnswer === true ? (
          <Animated.Text
            style={{
              opacity: opacityValue,
            }}
            className="text-center font-sans-bold text-lg text-correctAnswer"
          >
            {pointAmount}pts
          </Animated.Text>
        ) : null}
      </Animated.View>
    </>
  );
}

PopUp.propTypes = {
  pointAmount: PropTypes.number,
  isCorrectAnswer: PropTypes.bool,
};
