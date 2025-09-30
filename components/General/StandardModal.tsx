import { View, Modal, TouchableWithoutFeedback, Keyboard } from "react-native";
import Text from "./Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AlertNotificationRoot } from "react-native-alert-notification";
import BackButton from "./BackButton";
import PropTypes from "prop-types";

/**
 *
 * @param {Object} props Properties:
 * - modalVisible: Boolean declaring if modal is visible
 * - closeModal: Function for closing modal
 * - title: String for modal title
 * @returns
 */
const StandardModal = (props) => {
  StandardModal.propTypes = {
    modalVisible: PropTypes.bool,
    closeModal: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.element,
  };

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
              <View className="relative mx-4 my-6">
                {/* Back button */}
                <BackButton onPress={props.closeModal} />

                {/* Title */}
                <Text className="w-full text-center font-sans-bold text-xl">
                  {props.title}
                </Text>
              </View>

              {props.children}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </AlertNotificationRoot>
    </Modal>
  );
};

export default StandardModal;
