import type { ComponentProps } from "react";

export type MaterialCommunityIconName = ComponentProps<
  typeof import("@expo/vector-icons").MaterialCommunityIcons
>["name"];
