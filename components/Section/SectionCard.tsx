import React from "react";
import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "@/components/General/Text";
type icons = keyof typeof MaterialCommunityIcons.glyphMap;

export default function SectionCard({
  numOfEntries,
  title,
  progress,
  onPress,
  disabled,
  icon,
  disabledIcon,
  disableProgressNumbers,
}: {
  numOfEntries: number;
  title: string;
  progress: number;
  onPress: () => void;
  icon: icons;
  disabled?: boolean;
  disabledIcon?: icons;
  disableProgressNumbers?: boolean;
}) {
  disableProgressNumbers =
    disableProgressNumbers === undefined ? false : disableProgressNumbers;
  const isComplete = progress === numOfEntries;
  const inProgress = 0 < progress && progress < numOfEntries;
  const progressText = isComplete
    ? "Concluído"
    : inProgress
      ? "Em progresso"
      : "Não iniciado";
  const progressTextColor = isComplete ? "text-success" : "text-projectBlack";
  disabledIcon = disabledIcon ? disabledIcon : "lock-outline";

  return (
    <View>
      <TouchableOpacity
        className={`box-shadow-lg shadow-opacity-[1] elevation-[8] mx-[18] mb-[15] overflow-hidden rounded-lg bg-secondary ${disabled ? "bg-bgLockedLesson" : ""}`}
        onPress={onPress}
        disabled={disabled}
      >
        <View className="flex-row items-center justify-between px-[25] py-[15]">
          <View>
            <Text className="mb-2 font-montserrat-bold text-[16px] text-projectBlack">
              {title}
            </Text>

            <View className="flex-row items-center">
              <Text
                className={`font-montserrat text-[14px] ${progressTextColor}`}
              >
                {disableProgressNumbers ? "" : progress + "/" + numOfEntries}
                {" " + progressText}
              </Text>
            </View>
          </View>
          {disabled ? (
            <MaterialCommunityIcons
              testID="chevron-right"
              name={disabledIcon}
              size={25}
              color="gray"
            />
          ) : (
            <MaterialCommunityIcons
              testID="chevron-right"
              name={icon}
              size={25}
              color="gray"
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
