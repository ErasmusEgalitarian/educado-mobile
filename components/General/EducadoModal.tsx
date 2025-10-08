import {
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Text from "./Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AlertNotificationRoot } from "react-native-alert-notification";
import PropTypes from "prop-types";
import { ReactNode } from "react";

interface EducadoModalProps {
  children: ReactNode;
  modalVisible: boolean,
  closeModal: () => void,
  title: string
}

/**
 *
 * @param {Object} props Possible properties:
 * - modalVisible: Boolean declaring if modal is visible
 * - closeModal: Function for closing modal
 * - title: String for modal title
 * @returns
 */
export default function EducadoModal(props: EducadoModalProps) {
  return (
    <Modal
      visible={props.modalVisible}
      animationType="slide"
      className="border-black border-8"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={props.closeModal}>

        {/* ERROR BG IS PLACEHOLDER UNTILL BLACK OPACITY COLOUR WORKS!!! */}
        <View className="flex-1 justify-end bg-error">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="bg-projectWhite h-[90%] rounded-t-3xl pt-10">
              <AlertNotificationRoot>
              <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View className="flex flex-row justify-end px-[10%]">
                  <Pressable onPress={props.closeModal}>
                    <Entypo name="chevron-down" size={24} />
                  </Pressable>
                </View>

                <View className="flex flex-row justify-start px-[10%]">
                  <Text className="text-center text-2xl font-semibold">
                    {props.title ? props.title : ""}
                  </Text>
                </View>
                {props.children}
              </KeyboardAwareScrollView>
              </AlertNotificationRoot>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

EducadoModal.propTypes = {
  children: PropTypes.object,
  closeModal: PropTypes.func,
  modalVisible: PropTypes.bool,
  title: PropTypes.string,
};
