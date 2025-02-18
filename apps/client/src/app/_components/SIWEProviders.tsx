"use client";

import type { SIWEConfig } from "connectkit";
import React from "react";
import { ConnectKitProvider, SIWEProvider } from "connectkit";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { isAddress } from "viem";
import { useChainId, useDisconnect } from "wagmi";

import { api } from "~/trpc/react";

export function SIWEProviders({ children }: { children: React.ReactNode }) {
  const { mutateAsync } = api.auth.signUpWithAddress.useMutation();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const siweConfig: SIWEConfig = {
    getNonce: async () => getCsrfToken().then((res) => res ?? "none"),

    getSession: async () =>
      getSession().then((session) => {
        return session?.user &&
          session.user.name &&
          isAddress(session.user.name)
          ? {
              address: session.user.name,
              chainId,
            }
          : null;
      }),

    signOut: async () => {
      return signOut({ redirect: false }).then(() => {
        disconnect();
        return true;
      });
    },

    verifyMessage: async ({ message, signature }) =>
      mutateAsync({ message, signature })
        .then(async (data) => {
          if (!data) {
            return false;
          }
          const { message, signature } = data;
          await signIn("credentials", {
            message,
            signature,
            redirect: false,
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        }),

    createMessage: ({ nonce, address, chainId }) =>
      new SiweMessage({
        version: "1",
        domain: window.location.host,
        uri: window.location.origin,
        address,
        chainId,
        nonce,
        statement:
          "I agree to transfer the ultimate interpretation rights of the data to the platform.",
      }).prepareMessage(),
  };
  return (
    <SIWEProvider {...siweConfig}>
      <ConnectKitProvider theme="midnight">{children}</ConnectKitProvider>
    </SIWEProvider>
  );
}
