import { useRef, forwardRef, useImperativeHandle } from "react";
import { KeyboardAvoidingView, View, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg";
import Slick from "react-native-slick";
import Congratulation from "./Congratulation";
import PropTypes from "prop-types";
import Feedback from "./Feedback";

/* Check the CompleteCourse file in the screens folder for more info
props: 			onIndexChanged: function that is called when the index of which slide the student are currently on changes
				courseObject: the course object
*/

const CompleteCourseSlider = forwardRef(
  ({ onIndexChanged, setFeedbackData }, ref) => {
    CompleteCourseSlider.propTypes = {
      courseObject: PropTypes.object.isRequired,
      onIndexChanged: PropTypes.func.isRequired,
      setFeedbackData: PropTypes.func.isRequired,
    };

    CompleteCourseSlider.displayName = "CompleteCourseSlider";

    const slick = useRef(null);

    const tailwindConfig = require("../../../tailwind.config.js");
    const projectColors = tailwindConfig.theme.colors;

    const screens = [
      <Congratulation key={0} />,
      <Feedback setFeedbackData={setFeedbackData} key={1} />,
    ];

    const scrollBy = (number) => {
      if (slick.current) {
        slick.current.scrollBy(number, true);
      }
    };

    useImperativeHandle(ref, () => ({
      scrollBy,
    }));

    return (
      <Slick
        ref={slick}
        scrollEnabled={true}
        loop={false}
        index={0}
        dotColor={projectColors.projectWhite}
        dotStyle={{ width: 10, height: 10 }}
        activeDotColor={projectColors.primary_custom}
        activeDotStyle={{ width: 10, height: 10 }}
        height={700}
        showsButtons={true}
        paginationStyle={{ bottom: -15 }}
        onIndexChanged={(index) => {
          onIndexChanged(index);
        }}
        autoplayTimeout={10}
        autoplay={true}
        nextButton={
          <Svg className="mr-4 h-[25px] w-[25px]">
            <Path
              d="M8.59003 17.1239L13.17 12.5439L8.59003 7.95385L10 6.54385L16 12.5439L10 18.5439L8.59003 17.1239Z"
              fill={projectColors.projectBlack}
            />
          </Svg>
        }
        prevButton={
          <Svg className="ml-4 h-[25px] w-[25px]">
            <Path
              d="M15.41 17.1239L10.83 12.5439L15.41 7.95385L14 6.54385L8 12.5439L14 18.5439L15.41 17.1239Z"
              fill={projectColors.projectBlack}
            />
          </Svg>
        }
      >
        {screens.map((screen, index) => (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="height"
            keyboardVerticalOffset={80}
            key={index}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={{ flex: 1 }}>{screen}</View>
            </ScrollView>
          </KeyboardAvoidingView>
        ))}
      </Slick>
    );
  },
);

export default CompleteCourseSlider;
