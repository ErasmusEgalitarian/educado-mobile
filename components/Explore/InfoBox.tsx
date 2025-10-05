import React from "react";
import { View } from "react-native";
import * as Utility from "../../services/utils";
import InfoBoxItem from "./InfoBoxItem";

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
