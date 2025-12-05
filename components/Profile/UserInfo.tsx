import { View, Text } from "react-native";
import { ProfileNameCircle } from "@/components/Profile/ProfileNameCircle";

export interface UserInfoProps {
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Component for showing user information
 * @param {Object} props should contain the following properties:
 * - firstName: string
 * - lastName: string
 * - email: string
 * @returns {React.Element} React component
 */
export default function UserInfo(props: UserInfoProps) {
  return (
    <View className="flex flex-row items-center py-8">
      <View className="pr-6">
        <ProfileNameCircle
          className="h-14 w-14"
          firstName={props.firstName}
          lastName={props.lastName}
        />
      </View>
      <View className="w-[70%]">
        <Text className="text-body-regular">
          {props.firstName} {props.lastName}
        </Text>
        <Text className="text-caption-sm-regular">{props.email}</Text>
      </View>
    </View>
  );
}
