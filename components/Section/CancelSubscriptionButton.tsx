import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "@/theme/colors";
import { t } from "@/i18n";

export interface SubscriptionCancelButtonProps {
  onPress: () => void;
}

/**
 * Subscription cancellation button.
 *
 * @param onPress
 */
export const SubscriptionCancelButton = ({
  onPress,
}: SubscriptionCancelButtonProps) => {
  return (
    <View className="w-1/2 justify-end self-center py-4">
      <Button
        mode={"text"}
        color={colors.error}
        testID="subscriptionCancelButton"
        onPress={onPress}
        uppercase={false}
      >
        <Text className="underline text-subtitle-semibold">
          {t("course.withdraw")}
        </Text>
      </Button>
    </View>
  );
};
