export * from "../lib/loader";

import * as Long from "long";
export { Long };

export const arrayHeaderSize = 8;

export function hexdump(buffer: Uint8Array, offset: number, length: number): string {
  var out: string[] = [];
  for (let i = 0; i < length; ++i) {
    let b = buffer[offset + i].toString(16);
    if (b.length < 2) b = "0" + b;
    if ((i % 16) === 0) {
      let l = (offset + i).toString(16);
      while (l.length < 6) l = "0" + l;
      if (i > 0)
        out.push("\n");
      out.push("> " + l + ":");
    }
    out.push(" " + b);
  }
  return out.join("");
}
