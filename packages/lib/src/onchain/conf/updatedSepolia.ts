import { defineChain } from "viem";
import { sepolia } from "viem/chains";

export const updatedSepolia = /*#__PURE__*/ defineChain({
  ...sepolia,
  rpcUrls: {
    default: {
      http: ["https://sepolia.drpc.org"],
    },
  },
});
