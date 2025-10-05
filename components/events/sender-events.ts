import { EventRegister } from "react-native-event-listeners";

export const getPointsFromExerciseSender = (props) => {
  EventRegister.emit("getPointsFromExercise", props);
};
