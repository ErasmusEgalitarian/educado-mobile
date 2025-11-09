import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/theme/colors";

interface TooltipProps {
  tooltipKey: string;
  uniCodeIcon: string;
  children: React.ReactNode;
  position: object;
  tailSide: string;
  tailPosition: number;
}

const Tooltip = ({
  children,
  tooltipKey,
  uniCodeIcon,
  position,
  tailSide,
  tailPosition,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const storageKey = `tooltip_shown_${tooltipKey}`;

  useEffect(() => {
    const initializeTooltip = async () => {
      try {
        const shownTooltip = await AsyncStorage.getItem(storageKey);

        if (shownTooltip) {
          await AsyncStorage.setItem(storageKey, "true");
          setTimeout(() => {
            setIsVisible(true);
          }, 0);
        }
      } catch (error) {
        console.error("Error initializing tooltip:", error);
      }
    };

    void initializeTooltip();
  }, [storageKey]);

  if (!isVisible) {
    return null;
  }

  return (
    <View
      className={`absolute z-40 overflow-visible ${tailFlexDirection(tailSide)}`}
      style={[position]}
    >
      <View className="w-80 flex-col rounded-lg bg-surfaceSubtlePurple p-3">
        <View className="mb-3 flex-row">
          <Text className="items-start">{uniCodeIcon}</Text>
          <Text className="px-3 text-body-regular">{children}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-greyscaleTexticonSubtitle text-caption-lg-semibold">
            {" "}
            1/1{" "}
          </Text>
          <Pressable onPress={() => setIsVisible(false)}>
            <Text className="text-greyscaleTexticonSubtitle text-caption-lg-semibold">
              {" "}
              Fechar{" "}
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={tail(tailSide, tailPosition)} />
    </View>
  );
};

const tail = (side: string, position: number) => {
  const baseTail = {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: colors.surfaceSubtlePurple,
  };

  const alignment = {
    top: {
      ...baseTail,
      marginLeft: position,
    },
    right: {
      ...baseTail,
      marginTop: position,
      marginLeft: -4,
      transform: [{ rotate: "90deg" }],
    },
    bottom: {
      ...baseTail,
      marginLeft: position,
      marginTop: -1,
      transform: [{ rotate: "180deg" }],
    },
    left: {
      ...baseTail,
      marginTop: position,
      marginRight: -4,
      transform: [{ rotate: "-90deg" }],
    },
  };

  return alignment[side];
};

const tailFlexDirection = (side: string) => {
  const flexDirection = {
    top: "flex-col-reverse",
    bottom: "flex-col",
    left: "flex-row-reverse",
    right: "flex-row",
  };

  return flexDirection[side];
};

export default Tooltip;
