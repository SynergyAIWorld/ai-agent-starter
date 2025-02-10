import { defineChain } from "viem";
import { mantle } from "viem/chains";

export const updatedMantle = /*#__PURE__*/ defineChain({
  ...mantle,
  rpcUrls: {
    default: {
      http: ["https://mantle-rpc.publicnode.com"],
    },
  },
});
