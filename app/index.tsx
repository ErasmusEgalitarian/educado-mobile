import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USE_EXPO_ROUTER = process.env.EXPO_PUBLIC_USE_EXPO_ROUTER === "1";

const Index = () => {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!USE_EXPO_ROUTER && mounted) {
        setHref("/legacy");

        return;
      }

      const hasShown = await AsyncStorage.getItem("hasShownWelcome");

      if (!hasShown) {
        await AsyncStorage.setItem("hasShownWelcome", "true");

        if (mounted) {
          setHref("/(auth)/welcome");
        }

        return;
      }

      if (mounted) {
        setHref("/(auth)/login");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!href) {
    return null;
  }

  return <Redirect href="/legacy" />;
};

export default Index;
