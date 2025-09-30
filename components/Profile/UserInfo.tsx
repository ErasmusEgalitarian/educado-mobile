import { View, Image } from "react-native";
import Text from "../General/Text";
import ProfileNameCircle from "./ProfileNameCircle";
import PropTypes from "prop-types";

/**
 * Component for showing user information
 * @param {Object} props should contain the following properties:
 * - firstName: string
 * - lastName: string
 * - email: string
 * - points: number
 * @returns {React.Element} React component
 */
export default function UserInfo(props) {
  UserInfo.propTypes = {
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    photo: PropTypes.string,
  };

  return (
    <View className="flex flex-row items-center p-6">
      <View className="pr-5">
        {props.photo ? (
          <Image
            source={{ uri: props.photo }}
            className="h-24 w-24 rounded-full"
          />
        ) : (
          <ProfileNameCircle
            firstName={props.firstName}
            lastName={props.lastName}
          />
        )}
      </View>
      <View className="w-[70%]">
        <Text className="font-sans-bold text-xl">
          {props.firstName} {props.lastName}
        </Text>
        <Text className="text-m font-sans-bold text-projectGray">
          {props.email}
        </Text>
      </View>
    </View>
  );
}
