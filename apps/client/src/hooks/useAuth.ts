"use client";

import { useModal } from "connectkit";
import { signIn, signOut } from "next-auth/react";

import { api } from "~/trpc/react";

type ResponseData = object;

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

interface AuthInfo {
  signInFn: (provider: providerProps) => void;
  signOutFn: (callback?: () => void) => void;
}

interface AuthProps {
  onSuccess?: (data: ResponseData | null) => void;
  onError?: (error: string) => void;
}

export type providerProps = "twitter" | "discord" | "wallet" | "telegram";

const useAuth = (props?: AuthProps): AuthInfo => {
  const { openSIWE } = useModal();
  const { mutate } = api.auth.bindTelegram.useMutation({
    onSuccess: (data) => {
      props?.onSuccess?.(data as ResponseData | null);
    },
    onError: (err) => {
      props?.onError?.(err.message);
    },
  });

  const signInFn = (provider: providerProps) => {
    if (provider == "telegram") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      window.Telegram?.Login.auth(
        { bot_id: "7203121683", request_access: "write", embed: 1 },
        (data: TelegramUser) => {
          mutate(data);
        },
      );
    } else if (provider == "twitter" || provider == "discord") {
      void signIn(provider);
    } else {
      openSIWE();
    }
  };

  const signOutFn = (callback?: () => void) => {
    void signOut().then(() => {
      callback?.();
    });
  };
  return { signInFn, signOutFn };
};
export default useAuth;
