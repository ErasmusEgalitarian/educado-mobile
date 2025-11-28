import {
  NativeEventEmitter,
  NativeModules,
  EmitterSubscription,
} from "react-native";

const { nativeModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(nativeModule);

let subscription: EmitterSubscription | null = null;

/**
 * Subscribes to the "getPointsFromExercise" event and invokes the provided callback with the event data.
 * @param callback - A function to be called when the event is emitted, receiving the event data as an argument.
 * @returns The subscription object which can be used to unsubscribe from the event.
 */
export const getPointsFromExerciseReceiver = (
  callback: (data: any) => void,
) => {
  subscription = eventEmitter.addListener("getPointsFromExercise", (data) => {
    if (typeof callback === "function") {
      callback(data);
    }
  });

  return subscription;
};

export const getPointsFromExerciseUnsubscribe = () => {
  subscription?.remove();
};
