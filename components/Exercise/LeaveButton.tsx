import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface LeaveButtonProps {
  navigationPlace: string;
}

const LeaveButton = ({ navigationPlace }: LeaveButtonProps) => {
  // Navigation will be upgraded when moving to app-router. To typesafe current navigation is painful why it is omitted.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  return (
    <IconButton
      size={25}
      icon={"chevron-left"}
      color={colors.textBodyGrayscale}
      style={{ height: 48, width: 48 }}
      onPress={() => {
        // Navigation will be upgraded when moving to app-router. To typesafe current navigation is painful why it is omitted.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        navigation.navigate(navigationPlace);
      }}
    />
  );
};

export default LeaveButton;
