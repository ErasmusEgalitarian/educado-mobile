import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from "../General/Text";

export default function SettingsButton() {
  const navigation = useNavigation();

  const handleGearIconPress = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <View className="my-3 flex w-screen items-center px-6">
      <TouchableOpacity
        className="w-full rounded-medium bg-primary_custom px-10 py-4"
        onPress={handleGearIconPress}
      >
        <View className="flex flex-row items-center justify-center">
          <Text className="font-sans-bold text-center text-body text-projectWhite">
            Configurações
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
