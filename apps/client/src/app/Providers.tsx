"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

import { ProfileProvider } from "~/app/_components/ProfileContext";
import { Web3Providers } from "~/app/_components/Web3Providers";
import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <TRPCReactProvider>
          <Web3Providers>
            <ProfileProvider>{children}</ProfileProvider>
          </Web3Providers>
        </TRPCReactProvider>
      </SessionProvider>
    </>
  );
}
