import { useState, useEffect } from "react";
import { View } from "react-native";
import Text from "../../General/Text";
import LottieView from "lottie-react-native";
import { getUserInfo } from "../../../services/storage-service";

/* Check the CompleteCourseSlider file in the screens folder for more info */

export default function Congratulation() {
  const [name, setName] = useState("");

  const getName = async () => {
    const userInfo = await getUserInfo();
    setName(userInfo.firstName);
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <View className="flex h-full w-full items-center justify-start">
      <Text className="p-4 text-center font-sans-bold text-3xl text-primary_custom">
        Excelente trabalho, você terminou!
      </Text>

      <View className="h-80 w-full items-center">
        <LottieView
          style={{
            width: "100%",
            height: "100%",
          }}
          source={require("../../../assets/animations/rocket.json")}
          autoPlay
        />
      </View>

      <View>
        <Text className="mt-12 px-5 text-center text-lg text-projectBlack">
          Bom trabalho, {name}! Você pode ver suas estatísticas, placar educado
          e certificação antes de continuar.
        </Text>
      </View>
    </View>
  );
}
