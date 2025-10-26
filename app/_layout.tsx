import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BaseScreen } from "@/components/General/BaseScreen";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { DownloadProvider } from "@/services/DownloadProvider";
import "@/global.css";
import { QueryProvider } from "@/services/query-client";

const RootLayout = () => {
  return (
    // GestureHandlerRootView needs the inline style to work properly.
    // eslint-disable-next-line eslint-plugin-react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BaseScreen>
        <IconRegistry icons={EvaIconsPack} />
        {/* The Eva Design System is deprecated and buggy, so we need to suppres the error until we migrate. */}
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment*/}
        <ApplicationProvider {...eva} theme={eva.light}>
          <DownloadProvider>
            <QueryProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </QueryProvider>
          </DownloadProvider>
        </ApplicationProvider>
      </BaseScreen>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
