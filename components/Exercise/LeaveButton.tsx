import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
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
    <Pressable
      onPress={() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        navigation.navigate("HomeStack", {
          screen: "Perfil",
          params: {
            screen: "ProfileHome",
          },
        });
      }}
      className="h-48 w-48"
    >
      <MaterialCommunityIcons
        size={25}
        name="chevron-left"
        color={colors.textBodyGrayscale}
      />
    </Pressable>
  );
};

export default LeaveButton;
