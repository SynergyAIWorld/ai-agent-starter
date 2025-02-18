export class NetPack {
  private static intToBigEndian(num: number, bytes: number) {
    const byteArray = new Uint8Array(bytes);
    for (let i = bytes - 1; i >= 0; i--) {
      byteArray[i] = num & 0xff;
      num >>= 8;
    }
    return byteArray;
  }

  public static pack(packname: string, buffer: Uint8Array) {
    const nameszBuffer = this.intToBigEndian(packname.length, 2);

    const sendBuffer = new Uint8Array(
      nameszBuffer.length + packname.length + buffer.length,
    );
    sendBuffer.set(nameszBuffer, 0);
    sendBuffer.set(
      Array.from(packname, (c) => c.charCodeAt(0)),
      nameszBuffer.length,
    );
    sendBuffer.set(buffer, nameszBuffer.length + packname.length);

    const szbuffer = this.intToBigEndian(sendBuffer.length, 2);

    const sends_buffer = new Uint8Array(szbuffer.length + sendBuffer.length);

    sends_buffer.set(szbuffer, 0);
    sends_buffer.set(sendBuffer, szbuffer.length);
    return sends_buffer;
  }

  public static unpack(arrayBuffer: ArrayBuffer) {
    return new Promise<{
      cmd: string;
      buffer: Uint8Array;
    }>((resolve, reject) => {
      const totalLength = new DataView(arrayBuffer, 0, 2).getUint16(0, false);

      if (arrayBuffer.byteLength != totalLength + 2) {
        reject(
          new Error(
            "Buffer is not long enough to contain the specified package.",
          ),
        );
        return;
      }
      const nameLength = new DataView(arrayBuffer, 2, 2).getUint16(0, false);
      const packname = new TextDecoder().decode(
        new Uint8Array(arrayBuffer.slice(4, 4 + nameLength)),
      );
      const packbuffer = new Uint8Array(
        arrayBuffer.slice(4 + nameLength, arrayBuffer.byteLength),
      );
      resolve({ cmd: packname, buffer: packbuffer });
    });
  }
}
