import { View, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import Text from "../../General/Text";
import PropTypes from "prop-types";

/* Check the CompleteCourseSlider file in the screens folder for more info */

export default function Certification({ courseObject }) {
  Certification.propTypes = {
    courseObject: PropTypes.object.isRequired,
  };

  return (
    <View className="flex h-full w-full items-center justify-start">
      <Text className="p-4 text-center font-sans-bold text-3xl text-primary_custom">
        Você Recebeu um Certificado!
      </Text>

      <View className="h-80 w-full items-center">
        <LottieView
          style={{
            width: "100%",
            height: "100%",
          }}
          source={require("../../../assets/animations/diploma.json")}
          autoPlay
        />
      </View>

      <View className="-mt-5">
        <TouchableOpacity
          // TODO - navigatie to certification when ready
          onPress={() => {}}
        >
          {/* Commented out for now, since the certification is not ready */}
          {/*<Text className="text-center font-sans-bold text-lg underline text-projectBlack">Ver Certificado</Text>*/}
        </TouchableOpacity>
      </View>

      <Text className="mt-8 px-5 text-center text-lg text-projectBlack">
        Parabéns, você concluiu o curso {courseObject.title} e recebeu uma
        certificação. Clique aqui para ver o certificado ou acesse em Perfil.
      </Text>
    </View>
  );
}
