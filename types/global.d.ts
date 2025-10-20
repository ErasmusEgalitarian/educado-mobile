declare module "*.png" {
  import { ImageSourcePropType } from "react-native";

  const src: ImageSourcePropType;

  export default src;
}

declare module "*.jpg" {
  import { ImageSourcePropType } from "react-native";

  const src: ImageSourcePropType;

  export default src;
}

declare module "*.svg";

declare module "eslint-config-expo/flat.js" {
  import type { Config } from "@eslint/core";
  const config: Config[];
  export default config;
}
