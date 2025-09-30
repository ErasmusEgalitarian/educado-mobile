import { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { EasingNode } from "react-native-reanimated";
import Text from "../General/Text";
import PropTypes from "prop-types";

//inspo from https://www.npmjs.com/package/react-native-animated-numbers?activeTab=code

/* This is basically a package, copied and modified */

// makes an array of numbers from 0 to 9
const NUMBERS = Array(10)
  .fill()
  .map((_, i) => i);

// custom hook to get the previous number
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  if (typeof ref.current === "undefined") {
    return 0;
  }

  return ref.current;
};

const AnimatedNumber = ({
  animateToNumber,
  fontStyle,
  animationDuration,
  easing,
}) => {
  // the previous number
  const prevNumber = usePrevious(animateToNumber);

  // takes the number and converts it to a string
  const animateToNumberString = String(Math.abs(animateToNumber));

  // takes the previous number and converts it to a string
  const prevNumberString = String(Math.abs(prevNumber));

  // splits the string into an array of numbers, thus 100 is [1,0,0]
  const animateToNumbersArr = Array.from(animateToNumberString, Number);

  const prevNumberersArr = Array.from(prevNumberString, Number);

  // the height of the text element
  const [numberHeight, setNumberHeight] = useState(0);

  // creates an array of animated values, one for each number e.g. 50 is 2 animated values
  const animations = animateToNumbersArr.map((__, index) => {
    // if the number is not a number (there is no prevNumber) then return 0
    if (typeof prevNumberersArr[index] !== "number") {
      return new Animated.Value(0);
    }

    // the height of the animation is the height of the text element * the number
    //e.g. if the text element is 25px high and the number is 2 then the height of the animation is 50px so the animation moves 50px up
    const animationHeight = -1 * (numberHeight * prevNumberersArr[index]);
    return new Animated.Value(animationHeight);
  });

  // when the text element is created, the height is set
  const setButtonLayout = (e) => {
    setNumberHeight(e.nativeEvent.layout.height);
  };

  // when the number changes, the animation is triggered
  useEffect(() => {
    // maps through the animations array and sets the animation e.g. 50 is 2 animations
    animations.map((animation, index) => {
      // if the number is not a number then return
      if (typeof animateToNumbersArr[index] !== "number") {
        return;
      }

      Animated.timing(animation, {
        // the animation moves the number up by the height of the text element * the number
        toValue: -1 * (numberHeight * animateToNumbersArr[index]),
        duration: animationDuration || 1400,
        useNativeDriver: true,
        easing: easing || EasingNode.elastic(1.2),
      }).start();
    });
  }, [animateToNumber, numberHeight]);

  // the translateY value for each number, how much it should move in the y axis
  const getTranslateY = (index) => {
    return animations[index];
  };

  return (
    <>
      {numberHeight !== 0 && (
        // creates a row
        <View style={{ flexDirection: "row" }}>
          {/* if negative number then - is viewed */}
          {animateToNumber < 0 && (
            <Text className={`${fontStyle}`} style={{ height: numberHeight }}>
              {"-"}
            </Text>
          )}
          {animateToNumbersArr.map((n, index) => {
            {
              /* if the one of indexes in the array is string then return it as is */
            }
            if (typeof n === "string") {
              return (
                <Text
                  key={index}
                  className={`${fontStyle}`}
                  style={{ height: numberHeight }}
                >
                  {String(n)}
                </Text>
              );
            }

            // else return the animated.view
            return (
              // the view for the numbers where all besides the current number are hidden
              <View
                key={index}
                style={{ height: numberHeight, overflow: "hidden" }}
              >
                {/* animate to the next number based */}
                <Animated.View
                  style={[
                    {
                      transform: [
                        {
                          translateY: getTranslateY(index),
                        },
                      ],
                    },
                  ]}
                >
                  {/* prints all the numbers from 0-9 but hides the unused numbers */}
                  {NUMBERS.map((number, i) => (
                    <View key={i} className="w-fit">
                      <Text
                        className={`${fontStyle}`}
                        style={{ height: numberHeight }}
                      >
                        {String(number)}
                      </Text>
                    </View>
                  ))}
                </Animated.View>
              </View>
            );
          })}
        </View>
      )}
      <Text
        className={`${fontStyle}`}
        style={{ position: "absolute", top: -999999 }}
        onLayout={setButtonLayout}
      >
        {String(0)}
      </Text>
    </>
  );
};

AnimatedNumber.propTypes = {
  animateToNumber: PropTypes.number,
  fontStyle: PropTypes.string,
  animationDuration: PropTypes.number,
  easing: PropTypes.func,
};

export default AnimatedNumber;
