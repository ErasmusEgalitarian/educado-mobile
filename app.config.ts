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
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            buildToolsVersion: "35.0.0",
          },
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
      ["expo-video"],
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
