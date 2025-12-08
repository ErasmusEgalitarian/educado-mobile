import { configureApiClient } from "@/api/openapi/api-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { PropsWithChildren, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 2,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((s) => {
    setOnline(!!s.isConnected);
  }),
);

const onAppStateChange = (status: AppStateStatus) => {
  focusManager.setFocused(status === "active");
};

configureApiClient();

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 1000,
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const nativeEventSubscription = AppState.addEventListener(
      "change",
      onAppStateChange,
    );

    return () => {
      nativeEventSubscription.remove();
    };
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
