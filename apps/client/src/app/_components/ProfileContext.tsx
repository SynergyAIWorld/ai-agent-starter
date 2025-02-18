import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

import useIsMobile from "~/hooks/common/useIsMobile";
import { api } from "~/trpc/react";

export const ProfileContext = React.createContext<{
  profile:
    | {
        referralCode?: string | null;
        nickName?: string;
        role?: number;
        points?: number;
        linedAccount: {
          twitter?: string | null;
          discord?: string | null;
          wallet?: string | null;
          telegram?: string | null;
        };
      }
    | null
    | undefined;
  refetch: (() => Promise<unknown>) | undefined;
  isMobile: boolean;
  isLoading: boolean;
}>({
  profile: undefined,
  isMobile: false,
  refetch: undefined,
  isLoading: false,
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const {
    data: profile,
    isError,
    refetch,
    isLoading,
  } = api.user.meProfile.useQuery();
  const { data: session } = useSession();
  useEffect(() => {
    if (isError && session?.user) {
      void signOut();
    }
  }, [isError]);
  return (
    <ProfileContext.Provider value={{ profile, refetch, isMobile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
}
