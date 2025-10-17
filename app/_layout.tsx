import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BaseScreen } from "@/components/General/BaseScreen";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";
import { DownloadProvider } from "@/services/DownloadProvider";
import "@/global.css";

const RootLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BaseScreen>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <DownloadProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </DownloadProvider>
        </ApplicationProvider>
      </BaseScreen>
    </GestureHandlerRootView>
  );
};

export default RootLayout;
