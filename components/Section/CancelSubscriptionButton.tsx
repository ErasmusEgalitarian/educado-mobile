import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { colors } from "@/theme/colors";

export type SubscriptionCancelButtonProps = {
  onPress: () => void;
};

const SubscriptionCancelButton = ({
  onPress,
}: SubscriptionCancelButtonProps) => {
  return (
    <View className="w-1/2 justify-end self-center py-4 underline">
      <Button
        mode={"text"}
        color={colors.error}
        testID="subscriptionCancelButton"
        onPress={onPress}
        uppercase={false}
      >
        <Text className="underline font-montserrat text-[14px]">Retirar curso</Text>
      </Button>
    </View>
  );
};

export default SubscriptionCancelButton;
