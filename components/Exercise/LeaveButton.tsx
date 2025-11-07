import { useNavigation } from "@react-navigation/native";
import { Icon, Button } from "@rneui/base";
import { colors } from "@/theme/colors";

interface LeaveButtonProps {
  navigationPlace: string;
}

const LeaveButton = ({ navigationPlace }: LeaveButtonProps) => {
  // Navigation will be upgraded when moving to app-router. To typesafe current navigation is painful why it is omitted.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  return (
    <Button
      className="h-12 w-12"
      color="invisible"
      radius="20"
      size="sm"
      onPress={() => {
        // Navigation will be upgraded when moving to app-router. To typesafe current navigation is painful why it is omitted.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        navigation.navigate(navigationPlace);
      }}
      icon={
        <Icon
          size={25}
          name="chevron-left"
          type="material-community"
          color={colors.textBodyGrayscale}
        />
      }
    ></Button>
  );
};

export default LeaveButton;
