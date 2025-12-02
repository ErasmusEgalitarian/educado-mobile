import { Pressable, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";

interface StartCourseButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surfaceDefaultCyan,
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 54,
    gap: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.projectWhite,
  },
});

export const StartCourseButton = ({
  onPress,
  disabled = false,
}: StartCourseButtonProps): JSX.Element => {
  return (
    <Pressable
      className="flex-row items-center justify-center rounded-xl"
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-body-bold" style={styles.buttonText}>
        {t("course.start")}
      </Text>
      <MaterialCommunityIcons
        name="play-circle"
        size={20}
        color={colors.projectWhite}
      />
    </Pressable>
  );
};
