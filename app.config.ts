const strapiToken = process.env.STRAPI_TOKEN;

export default {
  expo: {
    name: "Educado",
    slug: "educado-mobile",
    scheme: "educado-mobile",
    version: "2.1.5",
    owner: "educado-mobile-25",
    orientation: "portrait",
    icon: "./assets/images/logo_black240.png",
    splash: {
      image: "./assets/images/logo_black240.png",
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
        foregroundImage: "./assets/images/logo_black240.png",
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
    ],
    extra: {
      JWT_SECRET: "test",
      STRAPI_TOKEN: strapiToken,
      eas: {
        projectId: "eb5fcd66-c59f-46fb-8d8c-b5955fb36861",
      },
    },
    experiments: {
      typedRoutes: true,
    },
  },
};
