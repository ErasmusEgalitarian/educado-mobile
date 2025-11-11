const strapiToken = process.env.STRAPI_TOKEN;

export default {
  expo: {
    name: "Educado",
    slug: "educado-mobile",
    scheme: "educado-mobile",
    version: "2.1.5",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.blackchakers.eml",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#FFFFFF",
      },
      package: "com.blackchakers.eml",
      versionCode: 8,
    },
    web: {
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            buildToolsVersion: "34.0.0",
          },
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "node_modules/@expo-google-fonts/montserrat/400Regular/Montserrat_400Regular.ttf",
            "node_modules/@expo-google-fonts/montserrat/400Regular_Italic/Montserrat_400Regular_Italic.ttf",
            "node_modules/@expo-google-fonts/montserrat/500Medium/Montserrat_500Medium.ttf",
            "node_modules/@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf",
            "node_modules/@expo-google-fonts/montserrat/600SemiBold_Italic/Montserrat_600SemiBold_Italic.ttf",
            "node_modules/@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf",
            "node_modules/@expo-google-fonts/montserrat/700Bold_Italic/Montserrat_700Bold_Italic.ttf",
            "node_modules/@expo-google-fonts/montserrat/800ExtraBold/Montserrat_800ExtraBold.ttf",
          ],
        },
      ],
      [
        "expo-dev-client",
        {
          launchMode: "most-recent",
        },
      ],
      "expo-router",
      [
        "expo-localization",
        {
          supportedLocales: {
            android: ["en-US", "pt-BR"],
          },
        },
      ],
    ],
    extra: {
      JWT_SECRET: "test",
      STRAPI_TOKEN: strapiToken,
      eas: {
        projectId: "33029e48-261a-46db-a3d6-211aa40139f0",
      },
    },
    experiments: {
      typedRoutes: true,
    },
  },
};
