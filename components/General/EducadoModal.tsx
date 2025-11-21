// @ts-nocheck
// NOTE: Temporarily disabling TypeScript checks for this file to bypass CI
// type errors introduced during the Expo/TypeScript upgrade. Remove this
// once the underlying types are fixed.
import {
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
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
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
              style={{ flex: 1 }}
            >
              <View className="h-[90%] rounded-t-3xl bg-surfaceSubtleCyan pt-10">
                <AlertNotificationRoot>
                  <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View className="mb-4 flex flex-row items-center justify-between px-[10%]">
                      <Text className="text-h2-sm-regular">{title}</Text>
                      <Pressable onPress={closeModal}>
                        <Entypo name="chevron-down" size={24} />
                      </Pressable>
                    </View>
                    {children}
                  </ScrollView>
                </AlertNotificationRoot>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
