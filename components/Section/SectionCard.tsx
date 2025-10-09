import { View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Shadow } from "react-native-shadow-2";
import Text from "@/components/General/Text";
type Icons = keyof typeof MaterialCommunityIcons.glyphMap;

const SectionCard = ({
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
  icon: Icons;
  disabled?: boolean;
  disabledIcon?: Icons;
  disableProgressNumbers?: boolean;
}) => {
  disableProgressNumbers ??= false;
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
    <View className="mx-[18] mb-[20]">
      <Shadow
        startColor="#28363E14"
        distance={6}
        offset={[0, 3]}
        style={{ width: "100%" }}
      >
        <TouchableOpacity
          className={`bg-secondary ${disabled ? "bg-disabled" : ""}`}
          style={{ borderRadius: 10, transform: [{ scale: 1.02 }] }}
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
      </Shadow>
    </View>
  );
};

export default SectionCard;
