import { View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

const StartLaterButton = () => {
  const navigation = useNavigation();

  return (
    <View className="flex items-center justify-center">
      <Pressable
        onPress={() => navigation.navigate("Meus cursos")}
        className="flex w-80 items-center justify-center rounded-lg p-4"
      >
        <Text className="p-1 text-lg font-bold text-projectBlack underline">
          Voltar para a Home
        </Text>
      </Pressable>
    </View>
  );
};

export default StartLaterButton;
