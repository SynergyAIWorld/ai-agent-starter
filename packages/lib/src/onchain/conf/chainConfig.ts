import type { Address, PublicClient } from "viem";
import { createPublicClient, http } from "viem";
import * as chains from "viem/chains";

import { updatedMantle } from "./updatedMantle";

type ContractType = "claim" | "NFT" | "checkIn" | "token";
export const chainConfig: Record<
  number,
  {
    contract: Record<ContractType, { address: Address }>;
    client: PublicClient;
    startTime: number;
  }
> = {
  [chains.arbitrum.id]: {
    startTime: 1724986800000,
    contract: {
      NFT: { address: "0x000" },
      claim: { address: "0x000" },
      checkIn: { address: "0x000" },
      token: { address: "0x000" },
    },
    client: createPublicClient({
      chain: chains.arbitrum,
      transport: http(),
    }),
  },
  [chains.mantle.id]: {
    startTime: 1732809600000,
    contract: {
      NFT: { address: "0x000" },
      claim: { address: "0x000" },
      checkIn: { address: "0x000" },
      token: { address: "0x000" },
    },

    client: createPublicClient({
      chain: updatedMantle,
      transport: http(),
    }),
  },
};
