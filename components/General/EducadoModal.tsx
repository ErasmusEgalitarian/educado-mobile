import {
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { ReactNode } from "react";

interface EducadoModalProps {
  children: ReactNode;
  modalVisible: boolean;
  closeModal: () => void;
  title: string;
}

/**
 * The Educado modal component.
 *
 * @param children - Components rendered as children.
 * @param modalVisible - Boolean declaring if modal is visible.
 * @param closeModal - Function for closing modal.
 * @param title - String for modal title.
 */
export const EducadoModal = ({
  children,
  modalVisible,
  closeModal,
  title,
}: EducadoModalProps) => {
  return (
    <Modal visible={modalVisible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View className="flex-1 justify-end bg-modalOpacityBlue">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="h-[90%] rounded-t-3xl bg-surfaceSubtleCyan pt-10">
              <AlertNotificationRoot>
                <KeyboardAwareScrollView>
                  <View className="mb-4 flex flex-row items-center justify-between px-[10%]">
                    <Text className="text-h2-sm-regular">{title}</Text>
                    <Pressable onPress={closeModal}>
                      <Entypo name="chevron-down" size={24} />
                    </Pressable>
                  </View>
                  {children}
                </KeyboardAwareScrollView>
              </AlertNotificationRoot>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
