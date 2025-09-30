import {
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import EducadoLogo from "../Images/EducadoLogo";
import Text from "./Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AlertNotificationRoot } from "react-native-alert-notification";
import PropTypes from "prop-types";

/**
 *
 * @param {Object} props Possible properties:
 * - modalVisible: Boolean declaring if modal is visible
 * - closeModal: Function for closing modal
 * - title: String for modal title
 * @returns
 */
export default function EducadoModal(props) {
  return (
    <Modal
      visible={props.modalVisible}
      animationType="slide"
      className="border-black border-8"
    >
      <AlertNotificationRoot>
        <KeyboardAwareScrollView className="bg-secondary">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View className="flex justify-center pt-[10%]">
                <View className="flex flex-row justify-end px-[10%]">
                  <Pressable onPress={props.closeModal}>
                    <Entypo name="chevron-down" size={24} />
                  </Pressable>
                </View>
                <View className="my-[10%] flex flex-row justify-center">
                  <EducadoLogo fill="fill-black" />
                </View>
                <View className="flex flex-row justify-start px-[10%]">
                  <Text className="text-center text-[24px]">
                    {props.title ? props.title : ""}
                  </Text>
                </View>
              </View>
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </AlertNotificationRoot>
    </Modal>
  );
}

EducadoModal.propTypes = {
  children: PropTypes.object,
  closeModal: PropTypes.func,
  modalVisible: PropTypes.bool,
  title: PropTypes.string,
};
