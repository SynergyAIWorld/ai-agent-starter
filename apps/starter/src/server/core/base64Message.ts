export const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  const binaryString = String.fromCharCode(...uint8Array);
  const base64String = btoa(binaryString);
  return base64String;
};
