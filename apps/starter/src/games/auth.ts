import bs58 from "bs58";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";

import { env } from "~/env";
import { base64ToUint8Array } from "~/server/core/base64Message";

export function generateToken(address: string): string {
  return jwt.sign({ address }, env.JWT_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, env.JWT_TOKEN_SECRET);
    return true;
  } catch (error) {
    console.error("verifyToken error", error);
    return false;
  }
}
// signature : "atujjDIPrWbqBRP2dJ0aq8mdPl9Gjx8NR9/KZBYmhPYpIvq0lL4zID/bQPIBU1xzAhTVnJtKsjmQ+geFqkR7AA=="
// txtMsg : "ai1739429921725"
// wallet : "9KQ3hir3cKBbb5TsBcsHb66ngwhqQ84R9qe1itPE6uHn"
export function verifySignature(
  solanaAddress: string,
  signature: string,
  message: string,
): boolean {
  try {
    //const signatureUint8 = bs58.decode(signature);
    const signatureUint8 = base64ToUint8Array(signature);
    const publicKeyUint8 = bs58.decode(solanaAddress);
    const messageUint8 = new TextEncoder().encode(message);

    return nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKeyUint8,
    );
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

const auth = { generateToken, verifyToken, verifySignature };
export default auth;
