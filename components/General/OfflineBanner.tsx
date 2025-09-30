import { useEffect, useState, useRef } from "react";
import {
  Animated,
  Text,
  Modal,
  Easing,
  View,
  Pressable,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NetworkStatusObserver from "../../hooks/NetworkStatusObserver";
import { useNavigation } from "@react-navigation/native";

/**
 * A banner component that shows an offline notification.
 * It checks periodically for backend connectivity and displays a banner if the backend is not reachable.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const translateY = useRef(new Animated.Value(-100)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOnline ? -100 : 0, // Slide in or out
      duration: 1000,
      easing: Easing.cubic,
      useNativeDriver: true,
    }).start();
  }, [isOnline, translateY]);

  return (
    <>
      <NetworkStatusObserver setIsOnline={setIsOnline} />

      <Modal visible={modalVisible}>
        <View className="justify-center px-1 pt-6">
          <View className="mb-20 mt-6 self-center">
            <Image
              source={require("../../assets/images/logo.png")}
              className="h-[25.54] w-[175.88]"
            />
          </View>
          <MaterialCommunityIcons
            name="wifi-off"
            size={160}
            color="black"
            style={{ alignSelf: "center" }}
          />
          <Text className="text-center font-montserrat-semi-bold text-[24px]">
            {"\n"}Sem conexão com internet.
          </Text>
          <View className="flex-row flex-wrap justify-center">
            <Text className="text-center text-body">
              {/* You are offline. Connect to the internet to explore the courses. */}
              {"\n"}Você está sem acesso a internet. Vá para
            </Text>
            <View className="flex-row flex-wrap justify-center">
              <Text className="text-center font-montserrat-bold text-body">
                meus cursos
              </Text>
              <Text className="text-center text-body">
                e acesse os cursos baixados.{"\n"}
              </Text>
            </View>
          </View>
          <View className="items-center pt-6">
            <Pressable
              testID={"offlineExploreButton"}
              className="rounded-r-8 h-14 w-80 items-center justify-center rounded-md bg-primary_custom p-2"
              onPress={() => {
                navigation.navigate("Perfil", {
                  screen: "Download",
                });
                setModalVisible(!modalVisible);
              }}
            >
              {/* Click to explore courses */}
              <Text className="text-center font-sans-bold text-body text-projectWhite">
                Acesse meus cursos baixados
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
