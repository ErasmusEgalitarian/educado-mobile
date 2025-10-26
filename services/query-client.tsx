import { PropsWithChildren, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
  focusManager,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
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

export const QueryProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const sub = AppState.addEventListener("change", onAppStateChange);

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
