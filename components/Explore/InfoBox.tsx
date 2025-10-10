import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "@/components/General/Text";
import {CardLabel} from "@/components/Explore/CardLabel";
import CustomRating from "@/components/Explore/CustomRating";
import CourseButton from "@/components/Explore/CourseButton";
import * as Utility from "@/services/utils";
import colors from "@/theme/colors";
import type { ComponentProps } from "react";

type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

export interface InfoBoxItemProps {
  title: string;
  icon: MaterialCommunityIconName;
  className?: string;
}

export interface InfoBoxProps {
  course: {
    estimatedHours: number;
    difficulty: number;
  };
}

const InfoBoxItem = ({ title, icon, className }: InfoBoxItemProps) => {
  return (
    <View
      className={`flex-row items-center justify-start py-2 ${className ?? ""}`}
    >
      <MaterialCommunityIcons name={icon} size={20} color={colors.grayScale} />
      <Text className="pl-2 font-sans text-sm text-projectBlack">{title}</Text>
    </View>
  );
};

const InfoBox = ({ course }: InfoBoxProps) => {
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
