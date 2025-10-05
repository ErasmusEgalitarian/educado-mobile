import { View, Image, Pressable } from "react-native";
import { useFonts, VarelaRound_400Regular } from "@expo-google-fonts/dev";
import { useNavigation } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import Text from "../General/Text";
import PropTypes from "prop-types";

export default function ActiveExploreCard({ title, courseId, iconPath }) {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    VarelaRound_400Regular,
  });

  React.useEffect(() => {
    async function prepare() {
      if (!fontsLoaded) {
        await SplashScreen.preventAutoHideAsync();
      } else {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <Pressable
        style={{ shadowColor: "black", elevation: 10 }}
        className="m-2 h-24 w-2/5 flex-col items-center rounded-md bg-limeGreen"
        onPress={() => navigation.navigate("Course", { courseId: courseId })}
      >
        <View className="">
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "VarelaRound_400Regular",
              fontSize: 16,
              alignSelf: "center",
            }}
            className="text-gray-600 pt-4"
          >
            {title}
          </Text>
        </View>
        <View className="pt-2">
          {iconPath === "" ? (
            <Image
              className="h-10 w-10"
              source={require("../../assets/images/favicon.png")}
            ></Image>
          ) : (
            <Image className="h-10 w-10" source={{ uri: iconPath }}></Image>
          )}
        </View>
      </Pressable>
    );
  }
}

ActiveExploreCard.propTypes = {
  title: PropTypes.string,
  courseId: PropTypes.string,
  iconPath: PropTypes.string,
};
