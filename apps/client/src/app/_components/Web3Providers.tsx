"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig } from "connectkit";
import { createConfig, http, WagmiProvider } from "wagmi";
import { arbitrum } from "wagmi/chains";

import { SIWEProviders } from "~/app/_components/SIWEProviders";

const projectId = "b9dac30f6e97f1b0f51c7a5daf263dea";
const config = createConfig(
  getDefaultConfig({
    appName: "W3Clouds Agent",
    walletConnectProjectId: projectId,
    chains: [arbitrum],
    transports: {
      [arbitrum.id]: http(),
    },
    appIcon: "/icon-lg.png",
  }),
);
const queryClient = new QueryClient();

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SIWEProviders>{children}</SIWEProviders>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
