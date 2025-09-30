import { EventRegister } from "react-native-event-listeners";

export const getPointsFromExerciseReceiver = (callback) => {
  EventRegister.addEventListener("getPointsFromExercise", (data) => {
    if (callback && typeof callback === "function") {
      callback(data);
    }
  });
};

export const getPointsFromExerciseUnsubscribe = () => {
  EventRegister.removeEventListener("getPointsFromExercise");
};
