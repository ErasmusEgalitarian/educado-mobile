import { Text, View } from "react-native";
import { ReactNode, ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { cn } from "@/services/utils";

interface BadgeProps {
  icon: {
    name: ComponentProps<typeof MaterialCommunityIcons>["name"];
    color: string;
  };
  children: ReactNode;
  className?: string;
}

export const Badge = ({ icon, children, className }: BadgeProps) => {
  return (
    <View
      className={cn(
        "flex h-16 w-28 items-center justify-center rounded-md p-3",
        className,
      )}
    >
      <MaterialCommunityIcons name={icon.name} size={25} color={icon.color} />
      <Text className="text-center text-surfaceSubtleCyan">{children}</Text>
    </View>
  );
};
