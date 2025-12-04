import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BaseScreen } from "@/components/General/BaseScreen";
import { DownloadProvider } from "@/services/DownloadProvider";
import "@/global.css";
import { QueryProvider } from "@/services/query-client";

import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    // GestureHandlerRootView needs the inline style to work properly.
    // eslint-disable-next-line eslint-plugin-react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <BaseScreen>
            <DownloadProvider>
              <QueryProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </QueryProvider>
            </DownloadProvider>
          </BaseScreen>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
