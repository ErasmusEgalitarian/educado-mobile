import { Pressable, Text, StyleSheet, View } from "react-native";
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
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.projectWhite,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export const StartCourseButton = ({
  onPress,
  disabled = false,
}: StartCourseButtonProps): JSX.Element => {
  return (
    <Pressable
      className="rounded-xl"
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.contentContainer}>
        <Text className="text-body-bold" style={styles.buttonText}>
          {t("course.start")}
        </Text>
        <MaterialCommunityIcons
          name="play-circle"
          size={20}
          color={colors.projectWhite}
        />
      </View>
    </Pressable>
  );
};
