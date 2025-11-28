import { NativeModules } from "react-native";

const { SenderEventsModule: nativeModule } = NativeModules;

export const getPointsFromExerciseSender = (props: {
  exerciseId: string;
  attemptId: string;
}) => {
  return nativeModule.getPointsFromExerciseSender(
    props.exerciseId,
    props.attemptId,
  );
};
