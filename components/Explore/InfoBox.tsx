import React from "react";
import {
  Modal,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "@/components/General/Text";
import CardLabel from "@/components/Explore/CardLabel";
import CustomRating from "@/components/Explore/CustomRating";
import CourseButton from "@/components/Explore/CourseButton";
import * as Utility from "@/services/utils";
import { ScrollView } from "react-native-gesture-handler";
import { subscribe, addCourseToStudent } from "@/services/storage-service";
import { useNavigation } from "@react-navigation/native";
import colors from "@/theme/colors";

const InfoBoxItem = ({ title, icon }) => {
  return (
    <View className="flex-row items-center justify-start py-2">
      <MaterialCommunityIcons name={icon} size={20} color={colors.grayScale} />
      <Text className="text-s pl-2 font-sans text-projectBlack">{title}</Text>
    </View>
  );
};

const InfoBox = ({ course }) => {
  return (
    <View className="w-full flex-col rounded-2xl border border-solid border-grayScale px-4 py-1">
      <InfoBoxItem
        title={`${Utility.formatHours(course.estimatedHours)} de conteúdo (vídeos,\n exercícios, leituras complementares)`}
        icon="clock-outline"
      />
      <InfoBoxItem
        title={`Curso de Nível ${Utility.getDifficultyLabel(course.difficulty)}`}
        icon="book-multiple-outline"
      />
      <InfoBoxItem
        title="Certificado de Conclusão"
        icon="certificate-outline"
      />
      <InfoBoxItem title="Início imediato" icon="clock-fast" />
      <InfoBoxItem
        title="Acesso total por 1 ano"
        icon="calendar-month-outline"
      />
      <InfoBoxItem
        title="Assista onde e quando quiser! "
        icon="cellphone-link"
        className="mb-0"
      />
    </View>
  );
};

export default InfoBox;
