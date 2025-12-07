import {
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { ReactNode } from "react";

interface EducadoModalProps {
  children: ReactNode;
  modalVisible: boolean;
  closeModal: () => void;
  title: string;
}

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
          <View
            className="h-[86%] rounded-t-3xl bg-surfaceSubtleCyan pt-10"
            onStartShouldSetResponder={() => true}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
              className="flex-1"
            >
              <AlertNotificationRoot>
                <ScrollView keyboardShouldPersistTaps="handled">
                  <View className="mb-4 flex flex-row items-center justify-between px-[10%]">
                    <Text className="text-h2-sm-regular">{title}</Text>

                    <Pressable onPress={closeModal}>
                      <MaterialCommunityIcons name="chevron-down" size={24} />
                    </Pressable>
                  </View>
                  {children}
                </ScrollView>
              </AlertNotificationRoot>
            </KeyboardAvoidingView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
