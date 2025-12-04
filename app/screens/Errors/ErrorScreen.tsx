import { View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Text from "@/components/General/Text";

export default function ErrorScreen() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center">
      {/* Something went wrong */}
      <Text className="pb-10 text-2xl">Algo deu errado</Text>
      <Pressable
        style={{ elevation: 10 }}
        className="rounded-md border border-cyanBlue bg-cyanBlue p-2"
        onPress={() => {
          navigation.navigate("Explore");
        }}
      >
        {/* Go to Explore */}
        <Text style={{ fontSize: 20 }}>Ir para explorar</Text>
      </Pressable>
    </View>
  );
}
