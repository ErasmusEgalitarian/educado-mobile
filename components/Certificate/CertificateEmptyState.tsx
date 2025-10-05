import { useNavigation } from "@react-navigation/native";
import BackButton from "../General/BackButton";
import noCertificateImage from "../../assets/images/no-certificates.png";
import { Image, Pressable, Text, View, SafeAreaView } from "react-native";

export default function CertificateEmptyState() {
  const navigation = useNavigation();
  return (
    <SafeAreaView className="bg-secondary">
      <View className="flex h-full items-center justify-center">
        <View className="absolute left-0 right-0 top-0 mx-4 mb-6 mt-12">
          <BackButton onPress={() => navigation.navigate("ProfileHome")} />

          <Text className="w-full text-center font-sans-bold text-xl">
            Certificados
          </Text>
        </View>

        <View className="flex max-h-[347px] w-full items-center px-6">
          <Image
            className="h-32 w-32"
            source={noCertificateImage}
            alt="No Certificates"
          />
          <Text className="mt-4 text-center font-montserrat-semi-bold text-2xl">
            Nenhum certificado disponível :
          </Text>
          <Text className="my-4 text-center text-lg leading-[22px]">
            Você ainda não finalizou um curso. Acesse a página de cursos e
            continue seus estudos para emitir certificados.
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Meus cursos")}
            className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary_custom p-4"
          >
            <Text className="text-lg font-bold text-projectWhite">
              Ir para meus cursos
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
